-- Add model_url column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS model_url TEXT;

-- Create product_models table for 3D models
CREATE TABLE IF NOT EXISTS public.product_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  model_url TEXT NOT NULL,
  thumbnail_url TEXT,
  model_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_models_product_id ON public.product_models(product_id);

-- Add trigger for updated_at
CREATE TRIGGER set_product_models_updated_at
BEFORE UPDATE ON public.product_models
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Create RLS policies
ALTER TABLE public.product_models ENABLE ROW LEVEL SECURITY;

-- Everyone can read product models
CREATE POLICY "Anyone can read product models" 
ON public.product_models FOR SELECT 
USING (true);

-- Only admins can insert, update, delete product models
CREATE POLICY "Admins can manage product models" 
ON public.product_models FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
