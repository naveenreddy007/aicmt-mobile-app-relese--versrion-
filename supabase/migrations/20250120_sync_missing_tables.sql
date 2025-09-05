-- Comprehensive Migration: Sync Missing Tables with Database
-- Date: 2025-01-20
-- This migration adds all missing tables that exist in migration files but not in the current database

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 1. Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    visitors INTEGER NOT NULL DEFAULT 0,
    pageviews INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index on date to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);

-- 2. Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  certificate_number VARCHAR(100),
  issuing_authority VARCHAR(255),
  issue_date DATE,
  expiry_date DATE,
  image_url TEXT,
  document_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR(255),
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create media_library table for centralized media management
CREATE TABLE IF NOT EXISTS media_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  alt_text TEXT,
  caption TEXT,
  category VARCHAR(100) DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create factory_tours table
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
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'check_video_source' 
        AND table_name = 'factory_tours'
    ) THEN
        ALTER TABLE factory_tours ADD CONSTRAINT check_video_source 
          CHECK (
            (video_type = 'upload' AND video_file_path IS NOT NULL AND video_url IS NULL) OR
            (video_type = 'url' AND video_url IS NOT NULL AND video_file_path IS NULL)
          );
    END IF;
END $$;

-- 6. Create gallery table for managing categorized images
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

-- 7. Create journey_milestones table
CREATE TABLE IF NOT EXISTS journey_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    description TEXT,
    image_url VARCHAR(500),
    category VARCHAR(100) DEFAULT 'team',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    year VARCHAR(10),
    category VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Create impact_stories table
CREATE TABLE IF NOT EXISTS impact_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    stats VARCHAR(255),
    category VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_factory_tours_display_order ON factory_tours(display_order, is_active);
CREATE INDEX IF NOT EXISTS idx_factory_tours_created_at ON factory_tours(created_at);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_gallery_active ON gallery(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_display_order ON gallery(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_media_id ON gallery(media_id);
CREATE INDEX IF NOT EXISTS idx_journey_milestones_active_order ON journey_milestones(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_team_members_active_category_order ON team_members(is_active, category, display_order);
CREATE INDEX IF NOT EXISTS idx_achievements_active_category_order ON achievements(is_active, category, display_order);
CREATE INDEX IF NOT EXISTS idx_impact_stories_active_category_order ON impact_stories(is_active, category, display_order);

-- Enable Row Level Security for all tables
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE factory_tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_stories ENABLE ROW LEVEL SECURITY;

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON analytics TO anon;
GRANT ALL PRIVILEGES ON analytics TO authenticated;

GRANT SELECT ON certifications TO anon;
GRANT ALL PRIVILEGES ON certifications TO authenticated;

GRANT SELECT ON events TO anon;
GRANT ALL PRIVILEGES ON events TO authenticated;

GRANT SELECT ON media_library TO anon;
GRANT ALL PRIVILEGES ON media_library TO authenticated;

GRANT SELECT ON factory_tours TO anon;
GRANT ALL PRIVILEGES ON factory_tours TO authenticated;

GRANT SELECT ON gallery TO anon;
GRANT ALL PRIVILEGES ON gallery TO authenticated;

GRANT SELECT ON journey_milestones TO anon;
GRANT ALL PRIVILEGES ON journey_milestones TO authenticated;

GRANT SELECT ON team_members TO anon;
GRANT ALL PRIVILEGES ON team_members TO authenticated;

GRANT SELECT ON achievements TO anon;
GRANT ALL PRIVILEGES ON achievements TO authenticated;

GRANT SELECT ON impact_stories TO anon;
GRANT ALL PRIVILEGES ON impact_stories TO authenticated;

-- Create RLS policies for public read access to active records (with existence checks)
DO $$
BEGIN
    -- Analytics policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'analytics' AND policyname = 'Public can view analytics') THEN
        CREATE POLICY "Public can view analytics" ON analytics FOR SELECT USING (true);
    END IF;
    
    -- Certifications policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'certifications' AND policyname = 'Allow public read access to active certifications') THEN
        CREATE POLICY "Allow public read access to active certifications" ON certifications FOR SELECT USING (is_active = true);
    END IF;
    
    -- Events policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Allow public read access to active events') THEN
        CREATE POLICY "Allow public read access to active events" ON events FOR SELECT USING (is_active = true);
    END IF;
    
    -- Media library policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'media_library' AND policyname = 'Allow public read access to active media') THEN
        CREATE POLICY "Allow public read access to active media" ON media_library FOR SELECT USING (is_active = true);
    END IF;
    
    -- Factory tours policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'factory_tours' AND policyname = 'Allow public read access to active factory tours') THEN
        CREATE POLICY "Allow public read access to active factory tours" ON factory_tours FOR SELECT USING (is_active = true);
    END IF;
    
    -- Gallery policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gallery' AND policyname = 'Allow public read access to active gallery items') THEN
        CREATE POLICY "Allow public read access to active gallery items" ON gallery FOR SELECT USING (is_active = true);
    END IF;
    
    -- Journey milestones policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'journey_milestones' AND policyname = 'Allow public read access to active journey milestones') THEN
        CREATE POLICY "Allow public read access to active journey milestones" ON journey_milestones FOR SELECT USING (is_active = true);
    END IF;
    
    -- Team members policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'team_members' AND policyname = 'Allow public read access to active team members') THEN
        CREATE POLICY "Allow public read access to active team members" ON team_members FOR SELECT USING (is_active = true);
    END IF;
    
    -- Achievements policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'achievements' AND policyname = 'Allow public read access to active achievements') THEN
        CREATE POLICY "Allow public read access to active achievements" ON achievements FOR SELECT USING (is_active = true);
    END IF;
    
    -- Impact stories policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'impact_stories' AND policyname = 'Allow public read access to active impact stories') THEN
        CREATE POLICY "Allow public read access to active impact stories" ON impact_stories FOR SELECT USING (is_active = true);
    END IF;
END $$;

-- Create RLS policies for authenticated admin access (with existence checks)
DO $$
BEGIN
    -- Analytics authenticated policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'analytics' AND policyname = 'Authenticated users can manage analytics') THEN
        CREATE POLICY "Authenticated users can manage analytics" ON analytics FOR ALL USING (auth.role() = 'authenticated');
    END IF;
    
    -- Certifications authenticated policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'certifications' AND policyname = 'Allow authenticated users full access to certifications') THEN
        CREATE POLICY "Allow authenticated users full access to certifications" ON certifications FOR ALL USING (auth.role() = 'authenticated');
    END IF;
    
    -- Events authenticated policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Allow authenticated users full access to events') THEN
        CREATE POLICY "Allow authenticated users full access to events" ON events FOR ALL USING (auth.role() = 'authenticated');
    END IF;
    
    -- Media library authenticated policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'media_library' AND policyname = 'Allow authenticated users full access to media') THEN
        CREATE POLICY "Allow authenticated users full access to media" ON media_library FOR ALL USING (auth.role() = 'authenticated');
    END IF;
    
    -- Factory tours authenticated policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'factory_tours' AND policyname = 'Allow authenticated users to read all factory tours') THEN
        CREATE POLICY "Allow authenticated users to read all factory tours" ON factory_tours FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'factory_tours' AND policyname = 'Allow authenticated users to insert factory tours') THEN
        CREATE POLICY "Allow authenticated users to insert factory tours" ON factory_tours FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'factory_tours' AND policyname = 'Allow authenticated users to update factory tours') THEN
        CREATE POLICY "Allow authenticated users to update factory tours" ON factory_tours FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'factory_tours' AND policyname = 'Allow authenticated users to delete factory tours') THEN
        CREATE POLICY "Allow authenticated users to delete factory tours" ON factory_tours FOR DELETE TO authenticated USING (true);
    END IF;
    
    -- Gallery authenticated policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gallery' AND policyname = 'Allow authenticated users full access to gallery') THEN
        CREATE POLICY "Allow authenticated users full access to gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');
    END IF;
    
    -- Journey milestones authenticated policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'journey_milestones' AND policyname = 'Allow authenticated users full access to journey milestones') THEN
        CREATE POLICY "Allow authenticated users full access to journey milestones" ON journey_milestones FOR ALL USING (auth.uid() IS NOT NULL);
    END IF;
    
    -- Team members authenticated policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'team_members' AND policyname = 'Allow authenticated users full access to team members') THEN
        CREATE POLICY "Allow authenticated users full access to team members" ON team_members FOR ALL USING (auth.uid() IS NOT NULL);
    END IF;
    
    -- Achievements authenticated policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'achievements' AND policyname = 'Allow authenticated users full access to achievements') THEN
        CREATE POLICY "Allow authenticated users full access to achievements" ON achievements FOR ALL USING (auth.uid() IS NOT NULL);
    END IF;
    
    -- Impact stories authenticated policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'impact_stories' AND policyname = 'Allow authenticated users full access to impact stories') THEN
        CREATE POLICY "Allow authenticated users full access to impact stories" ON impact_stories FOR ALL USING (auth.uid() IS NOT NULL);
    END IF;
END $$;

-- Create updated_at triggers for all tables (with existence checks)
DO $$
BEGIN
    -- Analytics trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_analytics_updated_at') THEN
        CREATE TRIGGER update_analytics_updated_at
        BEFORE UPDATE ON analytics
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Certifications trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_certifications_updated_at') THEN
        CREATE TRIGGER update_certifications_updated_at
        BEFORE UPDATE ON certifications
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Events trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_events_updated_at') THEN
        CREATE TRIGGER update_events_updated_at
        BEFORE UPDATE ON events
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Media library trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_media_library_updated_at') THEN
        CREATE TRIGGER update_media_library_updated_at
        BEFORE UPDATE ON media_library
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Factory tours trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_factory_tours_updated_at') THEN
        CREATE TRIGGER update_factory_tours_updated_at
        BEFORE UPDATE ON factory_tours
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Gallery trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_gallery_updated_at') THEN
        CREATE TRIGGER update_gallery_updated_at
        BEFORE UPDATE ON gallery
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Journey milestones trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_journey_milestones_updated_at') THEN
        CREATE TRIGGER update_journey_milestones_updated_at
        BEFORE UPDATE ON journey_milestones
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Team members trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_team_members_updated_at') THEN
        CREATE TRIGGER update_team_members_updated_at
        BEFORE UPDATE ON team_members
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Achievements trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_achievements_updated_at') THEN
        CREATE TRIGGER update_achievements_updated_at
        BEFORE UPDATE ON achievements
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Impact stories trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_impact_stories_updated_at') THEN
        CREATE TRIGGER update_impact_stories_updated_at
        BEFORE UPDATE ON impact_stories
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Insert sample data for analytics (last 30 days)
INSERT INTO analytics (date, visitors, pageviews) VALUES
  (CURRENT_DATE - INTERVAL '30 days', 150, 450),
  (CURRENT_DATE - INTERVAL '29 days', 180, 520),
  (CURRENT_DATE - INTERVAL '28 days', 200, 600),
  (CURRENT_DATE - INTERVAL '27 days', 175, 525),
  (CURRENT_DATE - INTERVAL '26 days', 220, 660),
  (CURRENT_DATE - INTERVAL '25 days', 190, 570),
  (CURRENT_DATE - INTERVAL '24 days', 210, 630),
  (CURRENT_DATE - INTERVAL '23 days', 185, 555),
  (CURRENT_DATE - INTERVAL '22 days', 195, 585),
  (CURRENT_DATE - INTERVAL '21 days', 225, 675),
  (CURRENT_DATE - INTERVAL '20 days', 240, 720),
  (CURRENT_DATE - INTERVAL '19 days', 205, 615),
  (CURRENT_DATE - INTERVAL '18 days', 230, 690),
  (CURRENT_DATE - INTERVAL '17 days', 215, 645),
  (CURRENT_DATE - INTERVAL '16 days', 250, 750),
  (CURRENT_DATE - INTERVAL '15 days', 235, 705),
  (CURRENT_DATE - INTERVAL '14 days', 260, 780),
  (CURRENT_DATE - INTERVAL '13 days', 245, 735),
  (CURRENT_DATE - INTERVAL '12 days', 270, 810),
  (CURRENT_DATE - INTERVAL '11 days', 255, 765),
  (CURRENT_DATE - INTERVAL '10 days', 280, 840),
  (CURRENT_DATE - INTERVAL '9 days', 265, 795),
  (CURRENT_DATE - INTERVAL '8 days', 290, 870),
  (CURRENT_DATE - INTERVAL '7 days', 275, 825),
  (CURRENT_DATE - INTERVAL '6 days', 300, 900),
  (CURRENT_DATE - INTERVAL '5 days', 285, 855),
  (CURRENT_DATE - INTERVAL '4 days', 310, 930),
  (CURRENT_DATE - INTERVAL '3 days', 295, 885),
  (CURRENT_DATE - INTERVAL '2 days', 320, 960),
  (CURRENT_DATE - INTERVAL '1 day', 305, 915),
  (CURRENT_DATE, 330, 990)
ON CONFLICT (date) DO NOTHING;

-- Insert sample certifications
INSERT INTO certifications (title, description, certificate_number, issuing_authority, issue_date, image_url, display_order) VALUES
('CPCB Certification', 'Certified by the Central Pollution Control Board of India for biodegradable products', 'CPCB-2024-001', 'Central Pollution Control Board', '2024-01-15', '/images/certifications/cpcb-certificate.jpg', 1),
('MSME ZED Certification', 'Zero Efficiency Defects Production Process Certification', 'MSME-ZED-2024-002', 'Ministry of MSME', '2024-02-20', '/images/certifications/msme-zed-certificate.jpg', 2),
('Startup India Recognition', 'Recognized under Startup India initiative', 'STARTUP-2024-003', 'Department for Promotion of Industry and Internal Trade', '2024-03-10', '/images/certifications/startup-india-certificate.jpg', 3),
('ISO 14001:2015', 'Environmental Management System Certification', 'ISO-14001-2024-004', 'International Organization for Standardization', '2024-04-05', '/images/certifications/iso-14001-certificate.jpg', 4)
ON CONFLICT DO NOTHING;

-- Insert sample events
INSERT INTO events (title, description, content, event_date, location, image_url, is_featured) VALUES
('Sustainable Packaging Summit 2024', 'Join us at the annual sustainable packaging summit to discuss the future of eco-friendly packaging solutions.', 'A comprehensive event covering the latest trends in sustainable packaging, featuring industry experts and innovative solutions.', '2024-09-15 10:00:00+00', 'Mumbai, India', '/images/events/packaging-summit-2024.jpg', true),
('Green Technology Expo', 'Showcasing cutting-edge green technologies and sustainable innovations.', 'An exhibition featuring the latest in green technology, sustainable materials, and eco-friendly manufacturing processes.', '2024-10-20 09:00:00+00', 'Delhi, India', '/images/events/green-tech-expo.jpg', true),
('Biodegradable Materials Workshop', 'Hands-on workshop on biodegradable materials and their applications.', 'Interactive workshop covering the science behind biodegradable materials and their practical applications in various industries.', '2024-11-12 14:00:00+00', 'Bangalore, India', '/images/events/biodegradable-workshop.jpg', false)
ON CONFLICT DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE analytics IS 'Website analytics data with daily visitor and pageview counts';
COMMENT ON TABLE certifications IS 'Company certifications and accreditations';
COMMENT ON TABLE events IS 'Company events and activities';
COMMENT ON TABLE media_library IS 'Centralized media management for all uploaded files';
COMMENT ON TABLE factory_tours IS 'Factory tour videos and content';
COMMENT ON TABLE gallery IS 'Categorized image gallery linked to media library';
COMMENT ON TABLE journey_milestones IS 'Company journey and milestone achievements';
COMMENT ON TABLE team_members IS 'Team member profiles and information';
COMMENT ON TABLE achievements IS 'Company achievements and awards';
COMMENT ON TABLE impact_stories IS 'Stories showcasing company impact and contributions';