-- Temporary fix: Disable RLS for cart_items table
-- WARNING: Only use this for testing/development
-- Re-enable RLS in production with proper policies

-- Disable RLS temporarily
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;

-- Or if you want to keep RLS but allow all operations temporarily:
-- ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all for testing" ON cart_items FOR ALL USING (true) WITH CHECK (true);