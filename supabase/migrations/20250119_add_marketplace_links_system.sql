-- Migration: Add comprehensive marketplace links system to products
-- This allows admins to add custom marketplace URLs with names and logos
-- Date: 2025-01-19

-- Create product_marketplace_links table
CREATE TABLE IF NOT EXISTS product_marketplace_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    marketplace_name VARCHAR(100) NOT NULL,
    marketplace_url TEXT NOT NULL,
    logo_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_marketplace_links_product_id ON product_marketplace_links(product_id);
CREATE INDEX IF NOT EXISTS idx_product_marketplace_links_active ON product_marketplace_links(is_active);
CREATE INDEX IF NOT EXISTS idx_product_marketplace_links_display_order ON product_marketplace_links(display_order);
CREATE INDEX IF NOT EXISTS idx_product_marketplace_links_marketplace_name ON product_marketplace_links(marketplace_name);

-- Add composite index for efficient queries
CREATE INDEX IF NOT EXISTS idx_product_marketplace_links_product_active_order 
ON product_marketplace_links(product_id, is_active, display_order);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_product_marketplace_links_updated_at
    BEFORE UPDATE ON product_marketplace_links
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE product_marketplace_links ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow public read access to active marketplace links
CREATE POLICY "Allow public read access to active marketplace links"
    ON product_marketplace_links
    FOR SELECT
    USING (is_active = true);

-- Allow authenticated users to manage marketplace links
CREATE POLICY "Allow authenticated users to manage marketplace links"
    ON product_marketplace_links
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Grant permissions to roles
GRANT SELECT ON product_marketplace_links TO anon;
GRANT ALL PRIVILEGES ON product_marketplace_links TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE product_marketplace_links IS 'Stores marketplace links for products (Amazon, Flipkart, Zepto, etc.)';
COMMENT ON COLUMN product_marketplace_links.marketplace_name IS 'Custom name for the marketplace (e.g., Amazon, Flipkart, Zepto)';
COMMENT ON COLUMN product_marketplace_links.marketplace_url IS 'URL to the product on the marketplace';
COMMENT ON COLUMN product_marketplace_links.logo_url IS 'URL to the marketplace logo image';
COMMENT ON COLUMN product_marketplace_links.display_order IS 'Order for displaying multiple marketplace links';
COMMENT ON COLUMN product_marketplace_links.is_active IS 'Whether the marketplace link is active and should be displayed';

-- Insert sample marketplace data for common platforms
INSERT INTO product_marketplace_links (product_id, marketplace_name, marketplace_url, logo_url, display_order, is_active)
SELECT 
    p.id,
    'Amazon',
    COALESCE(p.amazon_url, 'https://amazon.in/search?k=' || REPLACE(p.name, ' ', '+')),
    'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    1,
    COALESCE(p.amazon_enabled, false)
FROM products p
WHERE p.amazon_url IS NOT NULL AND p.amazon_url != ''
ON CONFLICT DO NOTHING;

-- Add sample marketplace entries for demonstration
-- Note: These will only be added if there are existing products
DO $$
DECLARE
    sample_product_id UUID;
BEGIN
    -- Get a sample product ID if any exist
    SELECT id INTO sample_product_id FROM products LIMIT 1;
    
    IF sample_product_id IS NOT NULL THEN
        -- Add sample marketplace links
        INSERT INTO product_marketplace_links (product_id, marketplace_name, marketplace_url, logo_url, display_order, is_active)
        VALUES 
            (sample_product_id, 'Flipkart', 'https://flipkart.com/search?q=sample-product', 'https://img1a.flixcart.com/www/linchpin/fk-cp-zion/img/flipkart-plus_8d85f4.png', 2, true),
            (sample_product_id, 'Zepto', 'https://zepto.com/search?q=sample-product', 'https://cdn.zeptonow.com/web-static-assets-prod/artifacts/9b4b6d7d8b8c8f8e8d8c8f8e8d8c8f8e.svg', 3, true),
            (sample_product_id, 'Myntra', 'https://myntra.com/search?q=sample-product', 'https://constant.myntassets.com/web/assets/img/MyntraWebSprite_27_01_2021.png', 4, false)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Create a view for easy querying of products with their marketplace links
CREATE OR REPLACE VIEW products_with_marketplace_links AS
SELECT 
    p.*,
    COALESCE(
        json_agg(
            json_build_object(
                'id', pml.id,
                'marketplace_name', pml.marketplace_name,
                'marketplace_url', pml.marketplace_url,
                'logo_url', pml.logo_url,
                'display_order', pml.display_order,
                'is_active', pml.is_active
            ) ORDER BY pml.display_order, pml.marketplace_name
        ) FILTER (WHERE pml.id IS NOT NULL),
        '[]'::json
    ) AS marketplace_links
FROM products p
LEFT JOIN product_marketplace_links pml ON p.id = pml.product_id AND pml.is_active = true
GROUP BY p.id;

-- Grant access to the view
GRANT SELECT ON products_with_marketplace_links TO anon;
GRANT SELECT ON products_with_marketplace_links TO authenticated;

-- Add helpful functions

-- Function to get active marketplace links for a product
CREATE OR REPLACE FUNCTION get_product_marketplace_links(product_uuid UUID)
RETURNS TABLE(
    id UUID,
    marketplace_name VARCHAR(100),
    marketplace_url TEXT,
    logo_url TEXT,
    display_order INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pml.id,
        pml.marketplace_name,
        pml.marketplace_url,
        pml.logo_url,
        pml.display_order
    FROM product_marketplace_links pml
    WHERE pml.product_id = product_uuid 
      AND pml.is_active = true
    ORDER BY pml.display_order, pml.marketplace_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_product_marketplace_links(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_product_marketplace_links(UUID) TO authenticated;

-- Function to add or update marketplace link
CREATE OR REPLACE FUNCTION upsert_marketplace_link(
    p_product_id UUID,
    p_marketplace_name VARCHAR(100),
    p_marketplace_url TEXT,
    p_logo_url TEXT DEFAULT NULL,
    p_display_order INTEGER DEFAULT 0,
    p_is_active BOOLEAN DEFAULT true
)
RETURNS UUID AS $$
DECLARE
    link_id UUID;
BEGIN
    -- Check if link already exists for this product and marketplace
    SELECT id INTO link_id
    FROM product_marketplace_links
    WHERE product_id = p_product_id 
      AND marketplace_name = p_marketplace_name;
    
    IF link_id IS NOT NULL THEN
        -- Update existing link
        UPDATE product_marketplace_links
        SET 
            marketplace_url = p_marketplace_url,
            logo_url = COALESCE(p_logo_url, logo_url),
            display_order = p_display_order,
            is_active = p_is_active,
            updated_at = NOW()
        WHERE id = link_id;
    ELSE
        -- Insert new link
        INSERT INTO product_marketplace_links (
            product_id,
            marketplace_name,
            marketplace_url,
            logo_url,
            display_order,
            is_active
        ) VALUES (
            p_product_id,
            p_marketplace_name,
            p_marketplace_url,
            p_logo_url,
            p_display_order,
            p_is_active
        ) RETURNING id INTO link_id;
    END IF;
    
    RETURN link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the upsert function
GRANT EXECUTE ON FUNCTION upsert_marketplace_link(UUID, VARCHAR(100), TEXT, TEXT, INTEGER, BOOLEAN) TO authenticated;

-- Add validation constraints
ALTER TABLE product_marketplace_links 
ADD CONSTRAINT check_marketplace_url_format 
CHECK (marketplace_url ~* '^https?://.*');

ALTER TABLE product_marketplace_links 
ADD CONSTRAINT check_marketplace_name_not_empty 
CHECK (LENGTH(TRIM(marketplace_name)) > 0);

ALTER TABLE product_marketplace_links 
ADD CONSTRAINT check_display_order_positive 
CHECK (display_order >= 0);

-- Create unique constraint to prevent duplicate marketplace names per product
ALTER TABLE product_marketplace_links 
ADD CONSTRAINT unique_product_marketplace 
UNIQUE (product_id, marketplace_name);

COMMIT;