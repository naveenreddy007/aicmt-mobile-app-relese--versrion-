-- Create factory_tours table
CREATE TABLE IF NOT EXISTS factory_tours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_type VARCHAR(10) NOT NULL CHECK (video_type IN ('upload', 'url')),
  video_file_path TEXT,
  video_url TEXT,
  thumbnail_image TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add constraint to ensure either video_file_path or video_url is provided
ALTER TABLE factory_tours ADD CONSTRAINT check_video_source 
  CHECK (
    (video_type = 'upload' AND video_file_path IS NOT NULL AND video_url IS NULL) OR
    (video_type = 'url' AND video_url IS NOT NULL AND video_file_path IS NULL)
  );

-- Create index for display_order and is_active for better query performance
CREATE INDEX idx_factory_tours_display_order ON factory_tours(display_order, is_active);
CREATE INDEX idx_factory_tours_created_at ON factory_tours(created_at);

-- Enable RLS
ALTER TABLE factory_tours ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow public read access to active factory tours
CREATE POLICY "Allow public read access to active factory tours" ON factory_tours
  FOR SELECT USING (is_active = true);

-- Allow authenticated users to read all factory tours (for admin)
CREATE POLICY "Allow authenticated users to read all factory tours" ON factory_tours
  FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to insert factory tours
CREATE POLICY "Allow authenticated users to insert factory tours" ON factory_tours
  FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users to update factory tours
CREATE POLICY "Allow authenticated users to update factory tours" ON factory_tours
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Allow authenticated users to delete factory tours
CREATE POLICY "Allow authenticated users to delete factory tours" ON factory_tours
  FOR DELETE TO authenticated USING (true);

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON factory_tours TO anon;
GRANT ALL PRIVILEGES ON factory_tours TO authenticated;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_factory_tours_updated_at BEFORE UPDATE
    ON factory_tours FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();