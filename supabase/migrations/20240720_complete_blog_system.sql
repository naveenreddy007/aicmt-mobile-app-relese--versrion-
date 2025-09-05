-- Create ENUM type for blog post status if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_status_enum') THEN
        CREATE TYPE post_status_enum AS ENUM ('draft', 'published', 'archived');
    END IF;
END$$;

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create blog_posts table with proper relationships
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT,
    excerpt TEXT,
    author_id UUID REFERENCES auth.users(id),
    category_id UUID REFERENCES blog_categories(id),
    tags TEXT[] DEFAULT '{}',
    status post_status_enum NOT NULL DEFAULT 'draft',
    featured_image TEXT,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    publish_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    views_count INTEGER DEFAULT 0
);

-- Create blog_comments table
CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create blog_post_likes table for tracking user likes
CREATE TABLE IF NOT EXISTS blog_post_likes (
    post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_publish_date ON blog_posts(publish_date);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_categories_updated_at ON blog_categories;
CREATE TRIGGER update_blog_categories_updated_at
BEFORE UPDATE ON blog_categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_comments_updated_at ON blog_comments;
CREATE TRIGGER update_blog_comments_updated_at
BEFORE UPDATE ON blog_comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
    slug TEXT;
BEGIN
    -- Convert to lowercase
    slug := LOWER(title);
    
    -- Replace spaces and special characters with hyphens
    slug := REGEXP_REPLACE(slug, '[^a-z0-9\-_]+', '-', 'g');
    
    -- Remove multiple consecutive hyphens
    slug := REGEXP_REPLACE(slug, '\-+', '-', 'g');
    
    -- Remove leading and trailing hyphens
    slug := TRIM(BOTH '-' FROM slug);
    
    RETURN slug;
END;
$$ LANGUAGE plpgsql;

-- Create function to ensure unique slugs
CREATE OR REPLACE FUNCTION ensure_unique_blog_slug()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    new_slug TEXT;
    counter INTEGER := 1;
BEGIN
    -- If slug is provided, use it; otherwise generate from title
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        base_slug := generate_slug(NEW.title);
    ELSE
        base_slug := generate_slug(NEW.slug);
    END IF;
    
    new_slug := base_slug;
    
    -- Check if slug exists and append counter if needed
    WHILE EXISTS (SELECT 1 FROM blog_posts WHERE slug = new_slug AND id != NEW.id) LOOP
        counter := counter + 1;
        new_slug := base_slug || '-' || counter;
    END LOOP;
    
    NEW.slug := new_slug;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for unique slug generation
DROP TRIGGER IF EXISTS ensure_unique_blog_slug_trigger ON blog_posts;
CREATE TRIGGER ensure_unique_blog_slug_trigger
BEFORE INSERT OR UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION ensure_unique_blog_slug();

-- Create RLS policies for blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published posts" ON blog_posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can create posts" ON blog_posts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own posts" ON blog_posts
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Admin can do everything" ON blog_posts
    USING (auth.role() = 'service_role');

-- Create RLS policies for blog_comments
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view approved comments" ON blog_comments
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Authenticated users can create comments" ON blog_comments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Users can update their own comments" ON blog_comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admin can do everything with comments" ON blog_comments
    USING (auth.role() = 'service_role');

-- Seed some initial categories
INSERT INTO blog_categories (name, slug, description)
VALUES 
    ('Sustainability', 'sustainability', 'Articles about sustainable practices and environmental impact'),
    ('Industry News', 'industry-news', 'Latest news and updates from the biodegradable plastics industry'),
    ('Product Insights', 'product-insights', 'Detailed information about our products and their applications'),
    ('Research & Innovation', 'research-innovation', 'New developments and research in biodegradable materials'),
    ('Case Studies', 'case-studies', 'Real-world examples of our products in action')
ON CONFLICT (slug) DO NOTHING;
