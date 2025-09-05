-- Create storage buckets for reviews and other media

-- Create product-reviews bucket for review images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-reviews',
  'product-reviews',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for product-reviews bucket
CREATE POLICY "Anyone can view review images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-reviews');

CREATE POLICY "Authenticated users can upload review images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-reviews' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own review images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-reviews' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own review images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-reviews' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Grant permissions for anon users to view images
GRANT SELECT ON storage.objects TO anon;
GRANT SELECT ON storage.buckets TO anon;

-- Grant permissions for authenticated users
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;