-- AICMT International Database Schema
-- Initial migration file

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    features TEXT[],
    specifications JSONB,
    price DECIMAL(10, 2),
    image_url VARCHAR(255),
    category VARCHAR(100),
    is_featured BOOLEAN DEFAULT false,
    stock_status VARCHAR(50) DEFAULT 'in_stock',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    featured_image VARCHAR(255),
    author_id UUID,
    status VARCHAR(50) DEFAULT 'draft',
    tags TEXT[],
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50),
    message TEXT NOT NULL,
    product_interest VARCHAR(255),
    status VARCHAR(50) DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name VARCHAR(255),
    avatar_url VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    company VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media Library Table
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER,
    dimensions VARCHAR(50),
    alt_text VARCHAR(255),
    uploaded_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO Metadata Table
CREATE TABLE IF NOT EXISTS seo_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_path VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255),
    description TEXT,
    keywords TEXT[],
    og_image VARCHAR(255),
    canonical_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Permissions Table
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role Permissions Junction Table
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);

-- User Roles Junction Table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

-- Backups Table
CREATE TABLE IF NOT EXISTS backups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size INTEGER,
    backup_type VARCHAR(50) NOT NULL,
    created_by UUID,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Table
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_path VARCHAR(255) NOT NULL,
    visitor_id VARCHAR(255),
    referrer VARCHAR(255),
    user_agent TEXT,
    ip_address VARCHAR(50),
    country VARCHAR(100),
    device_type VARCHAR(50),
    visit_duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
    id VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certifications Table
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    issuing_body VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    valid_from DATE,
    valid_until DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name VARCHAR(255) NOT NULL,
    client_company VARCHAR(255),
    client_position VARCHAR(255),
    content TEXT NOT NULL,
    rating INTEGER,
    image_url VARCHAR(255),
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('admin', 'Administrator with full access'),
('editor', 'Can edit content but not manage users or settings'),
('author', 'Can create and edit their own content'),
('viewer', 'Read-only access to admin panel');

-- Insert default permissions
INSERT INTO permissions (name, description) VALUES
('manage_users', 'Create, update, and delete users'),
('manage_roles', 'Create, update, and delete roles'),
('manage_products', 'Create, update, and delete products'),
('manage_blog', 'Create, update, and delete blog posts'),
('manage_inquiries', 'View and respond to inquiries'),
('manage_media', 'Upload and manage media files'),
('manage_seo', 'Edit SEO metadata'),
('manage_settings', 'Edit site settings'),
('view_analytics', 'View site analytics'),
('manage_backups', 'Create and restore backups');

-- Assign permissions to admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'admin'),
    id
FROM permissions;

-- Assign content permissions to editor role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'editor'),
    id
FROM permissions 
WHERE name IN ('manage_products', 'manage_blog', 'manage_inquiries', 'manage_media', 'manage_seo', 'view_analytics');

-- Assign limited permissions to author role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'author'),
    id
FROM permissions 
WHERE name IN ('manage_blog', 'manage_media');

-- Assign view permission to viewer role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'viewer'),
    id
FROM permissions 
WHERE name = 'view_analytics';

-- Insert default settings
INSERT INTO settings (id, value, description) VALUES
('site_info', '{"site_name": "AICMT International", "tagline": "Biodegradable Solutions for a Sustainable Future", "contact_email": "info@aicmt.com", "contact_phone": "+91 123 456 7890", "address": "123 Green Tech Park, Bangalore, India"}', 'Basic site information'),
('social_media', '{"facebook": "https://facebook.com/aicmt", "twitter": "https://twitter.com/aicmt", "instagram": "https://instagram.com/aicmt", "linkedin": "https://linkedin.com/company/aicmt"}', 'Social media links'),
('seo_defaults', '{"title_suffix": " | AICMT International", "default_description": "AICMT International provides biodegradable plastic solutions for a sustainable future.", "default_keywords": ["biodegradable", "compostable", "sustainable", "eco-friendly", "plastic alternatives"]}', 'Default SEO settings');

-- Create RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create public read policies
CREATE POLICY "Public can view published products" ON products
    FOR SELECT USING (true);

CREATE POLICY "Public can view published blog posts" ON blog_posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view certifications" ON certifications
    FOR SELECT USING (true);

CREATE POLICY "Public can view testimonials" ON testimonials
    FOR SELECT USING (true);

-- Create authenticated user policies
CREATE POLICY "Authenticated users can create inquiries" ON inquiries
    FOR INSERT WITH CHECK (true);

-- Create admin policies
CREATE POLICY "Admins have full access to all tables" ON products
    USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role_id = (SELECT id FROM roles WHERE name = 'admin')))
    WITH CHECK (auth.uid() IN (SELECT user_id FROM user_roles WHERE role_id = (SELECT id FROM roles WHERE name = 'admin')));

-- Create functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_inquiries_updated_at
BEFORE UPDATE ON inquiries
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_media_updated_at
BEFORE UPDATE ON media
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_seo_metadata_updated_at
BEFORE UPDATE ON seo_metadata
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_roles_updated_at
BEFORE UPDATE ON roles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_permissions_updated_at
BEFORE UPDATE ON permissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_certifications_updated_at
BEFORE UPDATE ON certifications
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON testimonials
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
