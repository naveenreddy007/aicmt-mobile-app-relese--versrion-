-- Step 1: Create the ENUM type for blog post status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_status_enum') THEN
        CREATE TYPE post_status_enum AS ENUM ('draft', 'published', 'archived');
    END IF;
END$$;

-- Step 2: Alter the blog_posts table
BEGIN;

-- Change 'status' column from VARCHAR to ENUM
-- This is a multi-step process to avoid data loss.
ALTER TABLE public.blog_posts ADD COLUMN status_new post_status_enum;
UPDATE public.blog_posts SET status_new = status::post_status_enum WHERE status IN ('draft', 'published', 'archived');
ALTER TABLE public.blog_posts DROP COLUMN status;
ALTER TABLE public.blog_posts RENAME COLUMN status_new TO status;
ALTER TABLE public.blog_posts ALTER COLUMN status SET DEFAULT 'draft';
COMMENT ON COLUMN public.blog_posts.status IS 'Publication status of the blog post.';

-- Change 'seo_keywords' from TEXT to TEXT[]
-- This assumes existing keywords are stored as a comma-separated string.
ALTER TABLE public.blog_posts ADD COLUMN seo_keywords_new TEXT[];
-- This will convert 'keyword1, keyword2' into {'keyword1',' keyword2'}. The trim function in the app logic will handle whitespace.
UPDATE public.blog_posts SET seo_keywords_new = string_to_array(seo_keywords, ',') WHERE seo_keywords IS NOT NULL AND seo_keywords != '';
ALTER TABLE public.blog_posts DROP COLUMN seo_keywords;
ALTER TABLE public.blog_posts RENAME COLUMN seo_keywords_new TO seo_keywords;
COMMENT ON COLUMN public.blog_posts.seo_keywords IS 'Array of keywords for SEO.';

-- Add the missing foreign key constraint for author_id
-- This ensures that an author_id in blog_posts must correspond to a valid user in profiles.
-- ON DELETE SET NULL means if a user profile is deleted, their posts are kept but the author_id is set to NULL.
ALTER TABLE public.blog_posts
ADD CONSTRAINT blog_posts_author_id_fkey
FOREIGN KEY (author_id) REFERENCES public.profiles(id)
ON DELETE SET NULL;

COMMIT;
