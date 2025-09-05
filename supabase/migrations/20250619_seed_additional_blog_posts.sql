-- Seed additional blog posts
-- Assumes id, created_at, updated_at have default values (e.g., uuid_generate_v4() and now())
-- Assumes the author_id 'a1b2c3d4-e5f6-7890-1234-567890abcdef' exists in the 'profiles' table.

INSERT INTO blog_posts (
  title,
  slug,
  content,
  excerpt,
  author_id,
  category,
  tags,
  status,
  featured_image,
  seo_title,
  seo_description,
  seo_keywords,
  publish_date
) VALUES
(
  'Innovations in Biodegradable Polymers',
  'innovations-biodegradable-polymers',
  '# Exploring New Frontiers in Polymer Science

Biodegradable polymers are at the forefront of sustainable material innovation. This post delves into recent breakthroughs, including new formulations with enhanced properties and applications in diverse industries.

## Key Developments:
- **Enhanced Durability:** Scientists are developing polymers that maintain biodegradability while offering increased strength and longevity for specific applications.
- **Bio-based Feedstocks:** A shift towards using renewable, non-food crop feedstocks for polymer production.
- **Smart Polymers:** Polymers designed to degrade under specific environmental triggers, offering more controlled end-of-life scenarios.

Stay tuned as we continue to monitor the exciting advancements in this field.',
  'A look into the latest breakthroughs in biodegradable polymer science, from enhanced durability to smart degradation.',
  'a1b2c3d4-e5f6-7890-1234-567890abcdef', -- Example author_id
  'Material Science',
  ARRAY['polymers', 'biodegradable', 'innovation', 'sustainability', 'research'],
  'published',
  '/placeholder.svg?width=1200&height=630',
  'Latest Innovations in Biodegradable Polymer Technology | AICMT',
  'Discover the cutting-edge advancements in biodegradable polymers, their applications, and how they are shaping a sustainable future.',
  ARRAY['biodegradable polymers', 'polymer science', 'sustainable materials', 'material innovation'],
  '2025-06-15T09:00:00Z'
),
(
  'The Circular Economy: A Guide for Businesses',
  'circular-economy-business-guide',
  '# Understanding the Circular Economy Model

The circular economy offers a transformative approach to resource management, moving away from the traditional linear "take-make-dispose" model. This guide explores core principles and practical steps for businesses.

## Core Principles:
1.  **Design out waste and pollution.**
2.  **Keep products and materials in use.**
3.  **Regenerate natural systems.**

Implementing circular practices can lead to cost savings, new revenue streams, and enhanced brand reputation.',
  'An introductory guide for businesses looking to understand and implement circular economy principles for sustainability and growth.',
  NULL, -- No specific author assigned
  'Business Strategy',
  ARRAY['circular economy', 'sustainability', 'business', 'resource management', 'eco-design'],
  'draft',
  '/placeholder.svg?width=1200&height=630',
  'A Business Guide to the Circular Economy | AICMT',
  'Learn how your business can adopt circular economy principles to reduce waste, improve efficiency, and contribute to a sustainable future.',
  ARRAY['circular economy', 'sustainable business', 'waste reduction', 'business strategy'],
  NULL -- Not yet published
),
(
  'Upcoming Webinar: The Future of Green Packaging',
  'webinar-green-packaging-future',
  '# Join Our Upcoming Webinar!

We are excited to announce an upcoming webinar focused on "The Future of Green Packaging". Industry experts will discuss emerging trends, regulatory changes, and innovative solutions.

## Webinar Details:
- **Date:** July 15, 2025
- **Time:** 2:00 PM IST
- **Topics:** Biodegradable materials, compostable solutions, policy impacts, consumer expectations.

Registration details will be shared soon. Don''t miss this opportunity to gain valuable insights!',
  'Announcement for an upcoming webinar on the future of green packaging, featuring industry experts and discussions on key trends.',
  'a1b2c3d4-e5f6-7890-1234-567890abcdef', -- Example author_id
  'Events',
  ARRAY['webinar', 'green packaging', 'sustainability', 'industry event', 'eco-friendly'],
  'published', -- Published as an announcement
  '/placeholder.svg?width=1200&height=630',
  'Webinar: The Future of Green Packaging | AICMT',
  'Join AICMT for an insightful webinar on the future of green packaging. Explore trends, innovations, and regulatory landscapes with industry leaders.',
  ARRAY['green packaging', 'webinar', 'sustainable packaging', 'packaging trends', 'eco-friendly solutions'],
  '2025-06-20T11:00:00Z' -- Published today to announce a future event
);
