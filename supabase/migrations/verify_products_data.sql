-- Verify products and images data
SELECT 
  p.id,
  p.name,
  p.category,
  p.image_url as product_image_url,
  p.is_active,
  pi.image_url as primary_image_url,
  pi.is_primary
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
ORDER BY p.created_at DESC
LIMIT 10;

-- Count total products
SELECT COUNT(*) as total_products FROM products WHERE is_active = true;

-- Count total product images
SELECT COUNT(*) as total_product_images FROM product_images;