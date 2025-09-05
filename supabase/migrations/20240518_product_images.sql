-- Create product_images table for multiple images per product
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);

-- Add trigger for updated_at
CREATE TRIGGER set_product_images_updated_at
BEFORE UPDATE ON public.product_images
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Create RLS policies
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Everyone can read product images
CREATE POLICY "Anyone can read product images" 
ON public.product_images FOR SELECT 
USING (true);

-- Only admins can insert, update, delete product images
CREATE POLICY "Admins can manage product images" 
ON public.product_images FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Migrate existing product images to the new table
INSERT INTO public.product_images (product_id, image_url, alt_text, is_primary, display_order)
SELECT 
  id as product_id, 
  image_url, 
  name as alt_text, 
  TRUE as is_primary, 
  0 as display_order
FROM 
  public.products
WHERE 
  image_url IS NOT NULL AND image_url != '';
