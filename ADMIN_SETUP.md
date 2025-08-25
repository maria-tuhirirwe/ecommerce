# Admin Dashboard Setup Guide

## Database Setup

1. **Run Database Setup Script**
   - Open your Supabase project dashboard
   - Go to the SQL Editor
   - Copy and paste the contents of `database-setup.sql`
   - Run the script to create tables and sample data

## Admin User Creation

### Method 1: Sign up with Admin Role
1. Go to `/signup`
2. Enter your email and password
3. Select "Admin" from the role dropdown
4. Complete signup

### Method 2: Manual User Role Update (In Supabase Dashboard)
1. Go to Authentication > Users in your Supabase dashboard
2. Find your user account
3. Edit the user metadata to include:
   ```json
   {
     "role": "admin"
   }
   ```

## Admin Dashboard Features

### Access
- Admin users will see "Admin Dashboard" in the navigation
- Direct URL: `/admin/dashboard`
- Requires admin role to access

### Categories Management
- **View**: See all categories with product counts
- **Add**: Create new categories
- **Delete**: Remove categories (with confirmation)
- **Stats**: Total categories counter

### Products Management
- **View**: Browse all products with details
- **Add**: Create new products with:
  - Name, price, description
  - Category assignment
  - Image URL (optional)
- **Delete**: Remove products (with confirmation)
- **Stats**: Total products, inventory value, average price

### Dashboard Analytics
- **Total Products**: Count of all products
- **Total Categories**: Count of all categories  
- **Total Inventory Value**: Sum of all product prices
- **Average Product Price**: Calculated average

## Database Structure

### Categories Table
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR(255))
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Products Table
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR(255))
- description (TEXT)
- price (DECIMAL(10,2))
- image_url (TEXT)
- category_id (INTEGER, FK to categories)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Security Features

- **Row Level Security (RLS)**: Enabled on all tables
- **Admin-only Access**: Only admin users can modify data
- **Public Read**: Everyone can view categories and products
- **User Role Verification**: Checks user metadata for admin role

## Environment Requirements

Make sure your `.env` file has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Troubleshooting

### "Supabase is not configured" Error
- Check your environment variables are correct
- Ensure you've created the Supabase project
- Verify the project URL and anon key

### "Permission denied" Errors
- Run the database setup script to create RLS policies
- Ensure your user has the admin role in their metadata
- Check the authentication is working

### Products Not Loading
- Ensure categories exist before creating products
- Check that category_id references valid categories
- Verify the database tables were created properly

## Sample Data

The setup script includes sample data from your existing mock data:
- 5 categories (Electronics, Phones, Tablets, Laptops, Accessories)
- 5 sample products with realistic UGX pricing
- Proper category relationships

## Next Steps

1. Run the database setup script
2. Create your admin user account
3. Access `/admin/dashboard`
4. Start adding your real categories and products
5. The system will integrate with your existing shopping cart and product display