-- Add display_order column to product_images table
ALTER TABLE public.product_images
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Optionally, you might want to update existing images with a default order
-- This is a simple way, you might need more sophisticated logic
-- if you have existing images and want a specific order.
DO $$
DECLARE
    rec RECORD;
    counter INTEGER;
BEGIN
    FOR rec IN SELECT product_id FROM public.product_images GROUP BY product_id LOOP
        counter := 0;
        FOR rec_img IN SELECT id FROM public.product_images WHERE product_id = rec.product_id ORDER BY created_at LOOP
            UPDATE public.product_images SET display_order = counter WHERE id = rec_img.id;
            counter := counter + 1;
        END LOOP;
    END LOOP;
END $$;

-- Ensure the updated_at trigger is correctly set for this table
-- (This was in the 20240518_product_images.sql script but good to re-confirm)
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

-- Drop and recreate trigger if it exists to ensure it's up-to-date,
-- or create if it doesn't exist.
DROP TRIGGER IF EXISTS set_product_images_updated_at ON public.product_images;
CREATE TRIGGER set_product_images_updated_at
BEFORE UPDATE ON public.product_images
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
