-- Check current products and their images
SELECT 
  p.id,
  p.name,
  p.image_url as product_image_url,
  pi.image_url as product_images_url,
  pi.is_primary,
  pi.alt_text
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id
ORDER BY p.created_at DESC, pi.display_order ASC;

-- Count products and images
SELECT 
  'products' as table_name,
  COUNT(*) as count
FROM products
UNION ALL
SELECT 
  'product_images' as table_name,
  COUNT(*) as count
FROM product_images;