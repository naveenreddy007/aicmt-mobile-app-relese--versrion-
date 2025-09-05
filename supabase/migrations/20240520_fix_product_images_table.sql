-- This script ensures the product_images table is correctly structured.

-- Add missing columns if they don't exist.
-- It's safe to run this even if the columns partially exist.
ALTER TABLE public.product_images
ADD COLUMN IF NOT EXISTS alt_text TEXT,
ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT FALSE;


-- Ensure the updated_at trigger exists and is attached.
-- First, check if the function exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'set_updated_at') THEN
    CREATE FUNCTION public.set_updated_at()
    RETURNS TRIGGER AS $function$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $function$ LANGUAGE plpgsql;
  END IF;
END
$$;

-- Drop the trigger if it exists, then recreate it to ensure it's correct.
DROP TRIGGER IF EXISTS set_product_images_updated_at ON public.product_images;
CREATE TRIGGER set_product_images_updated_at
BEFORE UPDATE ON public.product_images
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();


-- Ensure RLS is enabled and policies are correctly configured.
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts before creating new ones.
DROP POLICY IF EXISTS "Anyone can read product images" ON public.product_images;
DROP POLICY IF EXISTS "Admins can manage product images" ON public.product_images;

-- Create a policy to allow public read access.
CREATE POLICY "Anyone can read product images"
ON public.product_images FOR SELECT
USING (true);

-- Create a policy to allow authenticated admins to manage images.
CREATE POLICY "Admins can manage product images"
ON public.product_images FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Backfill alt_text for any existing images using the product name.
UPDATE public.product_images pi
SET alt_text = p.name
FROM public.products p
WHERE pi.product_id = p.id AND (pi.alt_text IS NULL OR pi.alt_text = '');
