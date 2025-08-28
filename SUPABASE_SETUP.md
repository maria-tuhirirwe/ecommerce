# Supabase Database Setup

This guide explains how to set up the database tables and constraints for the e-commerce application.

## Required Tables

### 1. Categories Table

```sql
-- Create categories table
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT,
    description TEXT,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_slug ON categories(slug);
```

### 2. Products Table

```sql
-- Create products table
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT,
    description TEXT,
    price_cents INTEGER NOT NULL,
    stock INTEGER DEFAULT 0,
    images TEXT[],  -- Array of image URLs
    active BOOLEAN DEFAULT true,
    category_id BIGINT REFERENCES categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_products_price_cents ON products(price_cents);
```

### 3. Cart Items Table (MOST IMPORTANT FOR FIXING THE CART ISSUE)

```sql
-- Create cart_items table
CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,  -- This should match your auth user ID type
    product_id BIGINT NOT NULL REFERENCES products(id),
    qty INTEGER NOT NULL DEFAULT 1,
    price_cents_at_add INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- CRITICAL: Add unique constraint to prevent duplicate cart items
    CONSTRAINT unique_user_product UNIQUE(user_id, product_id)
);

-- Add indexes for better performance
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
```

## Row Level Security (RLS) Policies

### Categories Table - Public Read Access

```sql
-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Categories are publicly readable" ON categories
    FOR SELECT USING (true);

-- Allow authenticated users to insert/update (for admin functionality)
CREATE POLICY "Authenticated users can insert categories" ON categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update categories" ON categories
    FOR UPDATE USING (auth.role() = 'authenticated');
```

### Products Table - Public Read Access

```sql
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active products
CREATE POLICY "Active products are publicly readable" ON products
    FOR SELECT USING (active = true);

-- Allow authenticated users to see all products (for admin)
CREATE POLICY "Authenticated users can read all products" ON products
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert/update (for admin functionality)
CREATE POLICY "Authenticated users can insert products" ON products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products" ON products
    FOR UPDATE USING (auth.role() = 'authenticated');
```

### Cart Items Table - User-Specific Access

```sql
-- Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Users can only see their own cart items
CREATE POLICY "Users can view own cart items" ON cart_items
    FOR SELECT USING (auth.uid()::text = user_id);

-- Users can only insert their own cart items
CREATE POLICY "Users can insert own cart items" ON cart_items
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Users can only update their own cart items
CREATE POLICY "Users can update own cart items" ON cart_items
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Users can only delete their own cart items
CREATE POLICY "Users can delete own cart items" ON cart_items
    FOR DELETE USING (auth.uid()::text = user_id);
```

## Sample Data (Optional)

### Insert Sample Categories

```sql
INSERT INTO categories (name, description) VALUES
    ('Phones', 'Mobile phones and smartphones'),
    ('Tablets', 'Tablets and iPads'),
    ('Headsets and Earbuds', 'Audio accessories'),
    ('Chargers and Power Accessories', 'Charging cables and power banks'),
    ('Speakers', 'Bluetooth and wired speakers');
```

### Insert Sample Products

```sql
INSERT INTO products (name, description, price_cents, stock, category_id, images) VALUES
    ('iPhone 14', 'Latest Apple iPhone with advanced features', 120000000, 10, 1, ARRAY['https://example.com/iphone14.jpg']),
    ('Samsung Galaxy S23', 'Premium Android smartphone', 95000000, 15, 1, ARRAY['https://example.com/galaxy-s23.jpg']),
    ('iPad Air', 'Lightweight tablet for productivity', 80000000, 8, 2, ARRAY['https://example.com/ipad-air.jpg']),
    ('AirPods Pro', 'Noise-cancelling wireless earbuds', 35000000, 20, 3, ARRAY['https://example.com/airpods-pro.jpg']);
```

## Verification Queries

After setting up the tables, run these queries to verify everything is working:

### Test Cart Functionality

```sql
-- Test inserting cart items (replace 'test-user-id' with actual user ID)
INSERT INTO cart_items (user_id, product_id, qty, price_cents_at_add) 
VALUES ('test-user-id', 1, 2, 120000000);

-- Try inserting the same item again (should fail due to unique constraint)
INSERT INTO cart_items (user_id, product_id, qty, price_cents_at_add) 
VALUES ('test-user-id', 1, 1, 120000000);

-- Update existing cart item quantity
UPDATE cart_items 
SET qty = qty + 1 
WHERE user_id = 'test-user-id' AND product_id = 1;

-- View cart items with product details
SELECT ci.*, p.name as product_name, p.price_cents, p.images
FROM cart_items ci
JOIN products p ON p.id = ci.product_id
WHERE ci.user_id = 'test-user-id';
```

## Troubleshooting

### If Cart Issues Persist

1. **Check if unique constraint exists:**
   ```sql
   SELECT constraint_name, constraint_type 
   FROM information_schema.table_constraints 
   WHERE table_name = 'cart_items' AND constraint_type = 'UNIQUE';
   ```

2. **If constraint is missing, add it:**
   ```sql
   ALTER TABLE cart_items 
   ADD CONSTRAINT unique_user_product UNIQUE(user_id, product_id);
   ```

3. **Check for duplicate data:**
   ```sql
   SELECT user_id, product_id, COUNT(*) 
   FROM cart_items 
   GROUP BY user_id, product_id 
   HAVING COUNT(*) > 1;
   ```

4. **Remove duplicates if found:**
   ```sql
   DELETE FROM cart_items 
   WHERE id NOT IN (
       SELECT DISTINCT ON (user_id, product_id) id 
       FROM cart_items 
       ORDER BY user_id, product_id, created_at DESC
   );
   ```

## Next Steps

1. **Apply these SQL commands** in your Supabase SQL Editor
2. **Test the cart functionality** - adding items should now work correctly
3. **Verify RLS policies** are working by testing with different user accounts
4. **Add sample data** to test the application

The unique constraint on `(user_id, product_id)` is crucial for preventing duplicate cart items and allowing the upsert logic to work correctly.