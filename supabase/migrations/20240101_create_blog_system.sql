-- Create blog_posts table with proper structure
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category VARCHAR(100),
  tags TEXT[],
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured_image TEXT,
  seo_title VARCHAR(70),
  seo_description VARCHAR(160),
  seo_keywords TEXT[],
  publish_date TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#10B981',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog_tags table
CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog_post_tags junction table
CREATE TABLE IF NOT EXISTS blog_post_tags (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Create blog_comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_publish_date ON blog_posts(publish_date);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON blog_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_comments_updated_at BEFORE UPDATE ON blog_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
('Sustainability', 'sustainability', 'Articles about environmental sustainability and eco-friendly practices', '#10B981'),
('Technology', 'technology', 'Latest technology trends and innovations in biodegradable plastics', '#3B82F6'),
('Industry News', 'industry-news', 'News and updates from the biodegradable plastics industry', '#F59E0B'),
('Research', 'research', 'Research findings and scientific studies', '#8B5CF6'),
('Company News', 'company-news', 'Updates and news from AICMT International', '#EF4444')
ON CONFLICT (slug) DO NOTHING;

-- Insert default tags
INSERT INTO blog_tags (name, slug) VALUES
('Biodegradable', 'biodegradable'),
('Compostable', 'compostable'),
('Plastic Alternatives', 'plastic-alternatives'),
('Circular Economy', 'circular-economy'),
('Waste Management', 'waste-management'),
('Innovation', 'innovation'),
('Regulations', 'regulations'),
('Case Study', 'case-study')
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Blog posts - public can read published posts, authenticated users can manage
CREATE POLICY "Public can view published blog posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Authenticated users can manage blog posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');

-- Categories and tags - public read, authenticated write
CREATE POLICY "Public can view categories" ON blog_categories FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage categories" ON blog_categories FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view tags" ON blog_tags FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage tags" ON blog_tags FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view post tags" ON blog_post_tags FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage post tags" ON blog_post_tags FOR ALL USING (auth.role() = 'authenticated');

-- Comments - public can read approved, authenticated can manage
CREATE POLICY "Public can view approved comments" ON blog_comments FOR SELECT USING (status = 'approved');
CREATE POLICY "Anyone can create comments" ON blog_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can manage comments" ON blog_comments FOR ALL USING (auth.role() = 'authenticated');
