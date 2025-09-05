-- Check factory tours data
SELECT 
  id,
  title,
  video_type,
  video_file_path,
  video_url,
  thumbnail_image,
  is_active,
  display_order
FROM factory_tours
ORDER BY display_order;

-- Check if storage buckets exist
SELECT name, public FROM storage.buckets WHERE name IN ('videos', 'thumbnails');