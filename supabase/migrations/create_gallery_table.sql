-- Create gallery table for managing categorized images
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  media_id UUID REFERENCES media_library(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL CHECK (category IN ('facility', 'products', 'events')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  alt_text VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_gallery_active ON gallery(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_display_order ON gallery(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_media_id ON gallery(media_id);

-- Enable Row Level Security
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Create policies for gallery table
CREATE POLICY "Allow public read access to active gallery items" ON gallery
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users full access to gallery" ON gallery
  FOR ALL USING (auth.role() = 'authenticated');

-- Grant permissions to roles
GRANT SELECT ON gallery TO anon;
GRANT ALL PRIVILEGES ON gallery TO authenticated;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON gallery
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data linking to existing media (if any)
-- This will be populated through the admin interface