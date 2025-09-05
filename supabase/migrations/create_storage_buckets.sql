-- Create storage buckets for videos and thumbnails if they don't exist

-- Create videos bucket
INSERT INTO storage.buckets (id, name, public, created_at, updated_at)
VALUES ('videos', 'videos', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Create thumbnails bucket
INSERT INTO storage.buckets (id, name, public, created_at, updated_at)
VALUES ('thumbnails', 'thumbnails', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for videos bucket
CREATE POLICY "Public read access for videos" ON storage.objects
FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload videos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update videos" ON storage.objects
FOR UPDATE USING (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete videos" ON storage.objects
FOR DELETE USING (bucket_id = 'videos' AND auth.role() = 'authenticated');

-- Set up storage policies for thumbnails bucket
CREATE POLICY "Public read access for thumbnails" ON storage.objects
FOR SELECT USING (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated users can upload thumbnails" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'thumbnails' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update thumbnails" ON storage.objects
FOR UPDATE USING (bucket_id = 'thumbnails' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete thumbnails" ON storage.objects
FOR DELETE USING (bucket_id = 'thumbnails' AND auth.role() = 'authenticated');