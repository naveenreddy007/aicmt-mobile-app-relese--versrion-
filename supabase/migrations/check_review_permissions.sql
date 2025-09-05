-- Check current permissions for reviews and review_images tables
SELECT 
    grantee, 
    table_name, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
    AND table_name IN ('reviews', 'review_images')
    AND grantee IN ('anon', 'authenticated') 
ORDER BY table_name, grantee;

-- Check RLS policies for reviews table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
    AND tablename IN ('reviews', 'review_images');

-- Grant permissions if they don't exist
GRANT INSERT ON reviews TO anon;
GRANT INSERT ON reviews TO authenticated;
GRANT INSERT ON review_images TO anon;
GRANT INSERT ON review_images TO authenticated;

-- Create RLS policies for reviews if they don't exist
DROP POLICY IF EXISTS "Anyone can insert reviews" ON reviews;
CREATE POLICY "Anyone can insert reviews" ON reviews
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view approved reviews" ON reviews;
CREATE POLICY "Anyone can view approved reviews" ON reviews
    FOR SELECT
    USING (status = 'approved');

-- Create RLS policies for review_images if they don't exist
DROP POLICY IF EXISTS "Anyone can insert review images" ON review_images;
CREATE POLICY "Anyone can insert review images" ON review_images
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view review images" ON review_images;
CREATE POLICY "Anyone can view review images" ON review_images
    FOR SELECT
    USING (true);