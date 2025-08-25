-- Database setup for E-commerce platform
-- Run these SQL commands in your Supabase SQL editor

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  qty INTEGER NOT NULL DEFAULT 1,
  price_cents_at_add INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_categories_created_at ON categories(created_at);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- Insert sample data (based on solve.ts)
INSERT INTO categories (name) VALUES 
  ('Electronics'),
  ('Phones'),
  ('Tablets'),
  ('Laptops'),
  ('Accessories')
ON CONFLICT DO NOTHING;

-- Insert sample products (based on solve.ts and existing mock data)
INSERT INTO products (name, description, price, image_url, category_id) VALUES 
  (
    'iPhone 15 Pro',
    'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Perfect for photography and gaming.',
    4500000,
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&crop=center',
    (SELECT id FROM categories WHERE name = 'Phones' LIMIT 1)
  ),
  (
    'Samsung Galaxy S24 Ultra',
    'Premium Android smartphone with S Pen, 200MP camera, and AI-powered features.',
    4200000,
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&crop=center',
    (SELECT id FROM categories WHERE name = 'Phones' LIMIT 1)
  ),
  (
    'iPad Pro 12.9"',
    'Powerful tablet with M2 chip, Liquid Retina XDR display, and Apple Pencil support.',
    3800000,
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&crop=center',
    (SELECT id FROM categories WHERE name = 'Tablets' LIMIT 1)
  ),
  (
    'MacBook Pro 14"',
    'Professional laptop with M3 Pro chip, stunning Retina display, and all-day battery life.',
    7500000,
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&crop=center',
    (SELECT id FROM categories WHERE name = 'Laptops' LIMIT 1)
  ),
  (
    'AirPods Pro (3rd Gen)',
    'Active noise cancellation, spatial audio, and all-day battery life. Perfect for music and calls.',
    850000,
    'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop&crop=center',
    (SELECT id FROM categories WHERE name = 'Accessories' LIMIT 1)
  )
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS) for better security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies for categories (read-only for everyone, admin can modify)
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert categories" ON categories
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update categories" ON categories
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete categories" ON categories
  FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for products (read-only for everyone, admin can modify)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert products" ON products
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update products" ON products
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete products" ON products
  FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for cart_items (users can only access their own cart)
CREATE POLICY "Users can view their own cart items" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at 
  BEFORE UPDATE ON cart_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Storage policies for product images
-- Create storage bucket policy for product-images bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow everyone to view images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- Allow admins to upload images
CREATE POLICY "Admin can upload images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'product-images' AND 
  (auth.jwt() ->> 'role' = 'admin' OR auth.uid() IS NOT NULL)
);

-- Allow admins to delete images
CREATE POLICY "Admin can delete images" ON storage.objects FOR DELETE USING (
  bucket_id = 'product-images' AND 
  (auth.jwt() ->> 'role' = 'admin' OR auth.uid() IS NOT NULL)
);