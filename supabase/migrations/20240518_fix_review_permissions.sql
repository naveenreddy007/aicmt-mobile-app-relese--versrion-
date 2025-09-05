-- Fix review permissions to allow anonymous users to create reviews

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can create review images" ON review_images;
DROP POLICY IF EXISTS "Authenticated users can add images to their reviews" ON review_images;

-- Create new policies that allow both authenticated and anonymous users
CREATE POLICY "Anyone can create reviews" ON reviews
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create review images" ON review_images
  FOR INSERT WITH CHECK (true);

-- Grant INSERT permissions to anon role
GRANT INSERT ON reviews TO anon;
GRANT INSERT ON review_images TO anon;

-- Grant INSERT permissions to authenticated role (if not already granted)
GRANT INSERT ON reviews TO authenticated;
GRANT INSERT ON review_images TO authenticated;