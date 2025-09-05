-- Grant permissions for reviews and review_images tables

-- Grant permissions for reviews table
GRANT SELECT ON reviews TO anon;
GRANT ALL PRIVILEGES ON reviews TO authenticated;

-- Grant permissions for review_images table
GRANT SELECT ON review_images TO anon;
GRANT ALL PRIVILEGES ON review_images TO authenticated;

-- Ensure RLS is enabled on both tables
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reviews table
CREATE POLICY "Anyone can view approved reviews" ON reviews
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Authenticated users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews" ON reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create RLS policies for review_images table
CREATE POLICY "Anyone can view review images" ON review_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM reviews 
      WHERE reviews.id = review_images.review_id 
      AND reviews.status = 'approved'
    )
  );

CREATE POLICY "Authenticated users can create review images" ON review_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Admins can manage all review images" ON review_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );