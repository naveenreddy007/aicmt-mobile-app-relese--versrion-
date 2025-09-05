-- Insert product images for existing products
-- First, let's get the product IDs and add images for them

-- Insert images for the first few products
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
SELECT 
  p.id,
  CASE 
    WHEN p.category = 'packaging' THEN 'https://images.unsplash.com/photo-1615937691194-1851494539b9?q=80&w=800&auto=format&fit=crop'
    WHEN p.category = 'bags' THEN 'https://images.unsplash.com/photo-1599054802234-2d55476069a2?q=80&w=800&auto=format&fit=crop'
    WHEN p.category = 'films' THEN 'https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=800&auto=format&fit=crop'
    ELSE 'https://images.unsplash.com/photo-1615937691194-1851494539b9?q=80&w=800&auto=format&fit=crop'
  END as image_url,
  CONCAT(p.name, ' - Biodegradable product') as alt_text,
  true as is_primary,
  0 as display_order
FROM products p
WHERE p.id NOT IN (
  SELECT DISTINCT product_id 
  FROM product_images 
  WHERE is_primary = true
)
LIMIT 10;

-- Update products table image_url with the primary image
UPDATE products 
SET image_url = (
  SELECT pi.image_url 
  FROM product_images pi 
  WHERE pi.product_id = products.id 
    AND pi.is_primary = true 
  LIMIT 1
)
WHERE image_url IS NULL OR image_url = '';