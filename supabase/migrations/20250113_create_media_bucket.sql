-- Create storage bucket for media library
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media-library',
  'media-library',
  true,
  52428800, -- 50MB limit
  ARRAY[
    'image/jpeg',
    'image/png', 
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for media-library bucket
CREATE POLICY "Allow public read access to media library" ON storage.objects
  FOR SELECT USING (bucket_id = 'media-library');

CREATE POLICY "Allow authenticated users to upload to media library" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media-library' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Allow authenticated users to update their uploads" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'media-library' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Allow authenticated users to delete their uploads" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'media-library' AND 
    auth.role() = 'authenticated'
  );