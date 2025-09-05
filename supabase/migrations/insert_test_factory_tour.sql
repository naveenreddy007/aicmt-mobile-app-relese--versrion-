-- Insert a test factory tour with YouTube video
INSERT INTO factory_tours (
  title,
  description,
  video_type,
  video_url,
  display_order,
  is_active
) VALUES (
  'AICMT International Factory Tour',
  'Take a virtual tour of our state-of-the-art manufacturing facility and see how we create innovative products.',
  'url',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  1,
  true
)
ON CONFLICT (id) DO NOTHING;

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('videos', 'videos', true),
  ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO NOTHING;