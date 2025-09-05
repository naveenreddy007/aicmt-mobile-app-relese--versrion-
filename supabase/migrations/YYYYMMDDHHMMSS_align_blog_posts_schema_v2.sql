-- Step 1: Create the ENUM type for blog post status (if it doesn't already exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_status_enum') THEN
        CREATE TYPE post_status_enum AS ENUM ('draft', 'published', 'archived');
    END IF;
END$$;

-- Step 2: Alter the blog_posts table
BEGIN;

-- Change 'status' column from VARCHAR to ENUM (if not already done)
-- This checks if the column 'status_new' (temporary column from a previous attempt) exists.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'blog_posts' AND column_name = 'status' AND udt_name = 'post_status_enum'
    ) THEN
        -- If 'status' is not already the enum type, proceed with conversion
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'blog_posts' AND column_name = 'status' AND data_type = 'character varying'
        ) THEN
            ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS status_new post_status_enum;
            UPDATE public.blog_posts SET status_new = status::post_status_enum WHERE status IN ('draft', 'published', 'archived');
            ALTER TABLE public.blog_posts DROP COLUMN IF EXISTS status;
            ALTER TABLE public.blog_posts RENAME COLUMN status_new TO status;
            ALTER TABLE public.blog_posts ALTER COLUMN status SET DEFAULT 'draft';
            COMMENT ON COLUMN public.blog_posts.status IS 'Publication status of the blog post.';
        END IF;
    END IF;
END$$;


-- Change 'seo_keywords' from TEXT to TEXT[] (if not already done)
-- This assumes existing keywords are stored as a comma-separated string.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'blog_posts' AND column_name = 'seo_keywords' AND data_type = 'ARRAY' AND udt_name = '_text'
    ) THEN
        -- If 'seo_keywords' is not already text[], proceed with conversion
         IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'blog_posts' AND column_name = 'seo_keywords' AND data_type = 'text'
        ) THEN
            ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS seo_keywords_new TEXT[];
            UPDATE public.blog_posts SET seo_keywords_new = string_to_array(trim(both ' ' from seo_keywords), ',') WHERE seo_keywords IS NOT NULL AND seo_keywords != '';
            ALTER TABLE public.blog_posts DROP COLUMN IF EXISTS seo_keywords;
            ALTER TABLE public.blog_posts RENAME COLUMN seo_keywords_new TO seo_keywords;
            COMMENT ON COLUMN public.blog_posts.seo_keywords IS 'Array of keywords for SEO.';
        END IF;
    END IF;
END$$;

-- Clean up orphaned author_ids BEFORE adding the foreign key
UPDATE public.blog_posts
SET author_id = NULL
WHERE author_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE public.profiles.id = public.blog_posts.author_id
);

-- Add the missing foreign key constraint for author_id (if not already exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'blog_posts_author_id_fkey' AND table_name = 'blog_posts' AND constraint_type = 'FOREIGN KEY'
    ) THEN
        ALTER TABLE public.blog_posts
        ADD CONSTRAINT blog_posts_author_id_fkey
        FOREIGN KEY (author_id) REFERENCES public.profiles(id)
        ON DELETE SET NULL;
    END IF;
END$$;

COMMIT;

-- The TypeScript types in lib/supabase/database.types.ts remain the same as previously provided.
-- Make sure your `BlogPostStatus` enum is defined and used for the `status` field,
-- and `seo_keywords` is `string[] | null`.
