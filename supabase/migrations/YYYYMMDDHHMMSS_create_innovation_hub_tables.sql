-- Create a custom ENUM type for post status if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_status_enum') THEN
        CREATE TYPE post_status_enum AS ENUM ('draft', 'published', 'archived');
    END IF;
END$$;

-- 1. categories Table
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS and define policies for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to categories"
ON categories
FOR SELECT
USING (true);

CREATE POLICY "Allow admin full access to categories"
ON categories
FOR ALL
USING (auth.role() = 'service_role' OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin') -- Assuming 'admin' role in profiles
WITH CHECK (auth.role() = 'service_role' OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Trigger to update 'updated_at' timestamp
CREATE TRIGGER handle_updated_at_categories
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION moddatetime (updated_at);

-- 2. tags Table
CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS and define policies for tags
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to tags"
ON tags
FOR SELECT
USING (true);

CREATE POLICY "Allow admin full access to tags"
ON tags
FOR ALL
USING (auth.role() = 'service_role' OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin')
WITH CHECK (auth.role() = 'service_role' OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');


-- 3. research_posts Table
CREATE TABLE research_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content JSONB, -- For block-based editor like TipTap. Use TEXT if Markdown.
    excerpt TEXT,
    featured_image_url TEXT,
    status post_status_enum DEFAULT 'draft'::post_status_enum NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Link to user who wrote it
    category_id BIGINT REFERENCES public.categories(id) ON DELETE SET NULL, -- Article's primary category
    published_at TIMESTAMPTZ -- Optional: for scheduled publishing or tracking actual publish date
);

-- Add indexes for frequently queried columns
CREATE INDEX idx_research_posts_slug ON research_posts(slug);
CREATE INDEX idx_research_posts_status ON research_posts(status);
CREATE INDEX idx_research_posts_category_id ON research_posts(category_id);
CREATE INDEX idx_research_posts_author_id ON research_posts(author_id);


-- Enable RLS and define policies for research_posts
ALTER TABLE research_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to published research posts"
ON research_posts
FOR SELECT
USING (status = 'published'::post_status_enum);

CREATE POLICY "Allow admin full access to research posts"
ON research_posts
FOR ALL
USING (auth.role() = 'service_role' OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin')
WITH CHECK (auth.role() = 'service_role' OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Allow authors to manage their own draft research posts"
ON research_posts
FOR ALL
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id AND status = 'draft'::post_status_enum);


-- Trigger to update 'updated_at' timestamp
CREATE TRIGGER handle_updated_at_research_posts
BEFORE UPDATE ON research_posts
FOR EACH ROW
EXECUTE FUNCTION moddatetime (updated_at);

-- 4. research_post_tags (Join Table)
CREATE TABLE research_post_tags (
    post_id UUID NOT NULL REFERENCES public.research_posts(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id) -- Composite key
);

-- Enable RLS and define policies for research_post_tags
ALTER TABLE research_post_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to research_post_tags"
ON research_post_tags
FOR SELECT
USING (true); -- Access control will be primarily through the posts they link to

CREATE POLICY "Allow admin full access to research_post_tags"
ON research_post_tags
FOR ALL
USING (auth.role() = 'service_role' OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin')
WITH CHECK (auth.role() = 'service_role' OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Authors can manage tags for their own posts"
ON research_post_tags
FOR ALL
USING (EXISTS (SELECT 1 FROM research_posts WHERE research_posts.id = research_post_tags.post_id AND research_posts.author_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM research_posts WHERE research_posts.id = research_post_tags.post_id AND research_posts.author_id = auth.uid()));


COMMENT ON COLUMN research_posts.content IS 'Using jsonb is perfect for storing the output of a block-based editor like TipTap. Use text if using Markdown.';
COMMENT ON COLUMN research_posts.status IS 'Crucial for the admin workflow.';
