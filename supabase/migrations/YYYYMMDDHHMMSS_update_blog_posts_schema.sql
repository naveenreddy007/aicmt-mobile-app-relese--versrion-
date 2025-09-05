-- Create ENUM type for blog post status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_status_enum') THEN
        CREATE TYPE post_status_enum AS ENUM ('draft', 'published', 'archived');
    END IF;
END$$;

-- Add missing columns to blog_posts table
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS category TEXT NULL,
ADD COLUMN IF NOT EXISTS seo_title TEXT NULL,
ADD COLUMN IF NOT EXISTS seo_description TEXT NULL,
ADD COLUMN IF NOT EXISTS seo_keywords TEXT[] NULL;

-- Alter status column to use the new ENUM type
-- First, ensure existing values are compatible or handle them (e.g., map to NULL or a default enum value)
-- For simplicity, this script assumes existing values are 'draft', 'published', or can be mapped.
-- You might need to update existing data before changing the type if there are incompatible values.
-- Example: UPDATE blog_posts SET status = 'draft' WHERE status NOT IN ('draft', 'published', 'archived');

-- Add a temporary column
ALTER TABLE blog_posts ADD COLUMN status_new post_status_enum;

-- Copy data from old column to new, casting if necessary
-- This will only work if existing values are 'draft', 'published', 'archived'
UPDATE blog_posts SET status_new = status::post_status_enum
WHERE status IS NOT NULL AND status IN ('draft', 'published', 'archived');

-- If there are values not in the enum, you might set them to a default or NULL
UPDATE blog_posts SET status_new = 'draft' -- or NULL
WHERE status IS NOT NULL AND status NOT IN ('draft', 'published', 'archived');


-- Drop the old status column
ALTER TABLE blog_posts DROP COLUMN status;

-- Rename the new column to status
ALTER TABLE blog_posts RENAME COLUMN status_new TO status;

-- Set default for the new status column if desired
ALTER TABLE blog_posts ALTER COLUMN status SET DEFAULT 'draft';

-- Add a comment to the table for clarity
COMMENT ON TABLE blog_posts IS 'Stores blog articles, news, and updates.';
COMMENT ON COLUMN blog_posts.category IS 'Primary category of the blog post.';
COMMENT ON COLUMN blog_posts.seo_title IS 'Custom title for SEO purposes.';
COMMENT ON COLUMN blog_posts.seo_description IS 'Custom description for SEO purposes.';
COMMENT ON COLUMN blog_posts.seo_keywords IS 'Array of keywords for SEO.';
COMMENT ON COLUMN blog_posts.status IS 'Publication status of the blog post.';
