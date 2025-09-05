-- Create certifications table
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

-- Create events table
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

-- Create media_library table for centralized media management
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

-- Enable RLS
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON certifications TO anon;
GRANT ALL PRIVILEGES ON certifications TO authenticated;

GRANT SELECT ON events TO anon;
GRANT ALL PRIVILEGES ON events TO authenticated;

GRANT SELECT ON media_library TO anon;
GRANT ALL PRIVILEGES ON media_library TO authenticated;

-- Create RLS policies
CREATE POLICY "Allow public read access to active certifications" ON certifications
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users full access to certifications" ON certifications
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to active events" ON events
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users full access to events" ON events
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to active media" ON media_library
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users full access to media" ON media_library
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample certifications
INSERT INTO certifications (title, description, certificate_number, issuing_authority, issue_date, image_url, display_order) VALUES
('CPCB Certification', 'Certified by the Central Pollution Control Board of India for biodegradable products', 'CPCB-2024-001', 'Central Pollution Control Board', '2024-01-15', '/images/certifications/cpcb-certificate.jpg', 1),
('MSME ZED Certification', 'Zero Efficiency Defects Production Process Certification', 'MSME-ZED-2024-002', 'Ministry of MSME', '2024-02-20', '/images/certifications/msme-zed-certificate.jpg', 2),
('Startup India Recognition', 'Recognized under Startup India initiative', 'STARTUP-2024-003', 'Department for Promotion of Industry and Internal Trade', '2024-03-10', '/images/certifications/startup-india-certificate.jpg', 3),
('ISO 14001:2015', 'Environmental Management System Certification', 'ISO-14001-2024-004', 'International Organization for Standardization', '2024-04-05', '/images/certifications/iso-14001-certificate.jpg', 4);

-- Insert sample events
INSERT INTO events (title, description, content, event_date, location, image_url, is_featured) VALUES
('Sustainable Packaging Summit 2024', 'Join us at the annual sustainable packaging summit to discuss the future of eco-friendly packaging solutions.', 'A comprehensive event covering the latest trends in sustainable packaging, featuring industry experts and innovative solutions.', '2024-09-15 10:00:00+00', 'Mumbai, India', '/images/events/packaging-summit-2024.jpg', true),
('Green Technology Expo', 'Showcasing cutting-edge green technologies and sustainable innovations.', 'An exhibition featuring the latest in green technology, sustainable materials, and eco-friendly manufacturing processes.', '2024-10-20 09:00:00+00', 'Delhi, India', '/images/events/green-tech-expo.jpg', true),
('Biodegradable Materials Workshop', 'Hands-on workshop on biodegradable materials and their applications.', 'Interactive workshop covering the science behind biodegradable materials and their practical applications in various industries.', '2024-11-12 14:00:00+00', 'Bangalore, India', '/images/events/biodegradable-workshop.jpg', false);