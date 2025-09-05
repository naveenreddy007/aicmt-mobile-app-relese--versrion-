-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);

-- Add trigger for updated_at
CREATE TRIGGER set_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Create review_images table for multiple images per review
CREATE TABLE IF NOT EXISTS public.review_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_review_images_review_id ON public.review_images(review_id);

-- Create review_responses table for admin responses to reviews
CREATE TABLE IF NOT EXISTS public.review_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_review_responses_review_id ON public.review_responses(review_id);

-- Add trigger for updated_at
CREATE TRIGGER set_review_responses_updated_at
BEFORE UPDATE ON public.review_responses
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Create RLS policies
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_responses ENABLE ROW LEVEL SECURITY;

-- Everyone can read approved reviews
CREATE POLICY "Anyone can read approved reviews" 
ON public.reviews FOR SELECT 
USING (status = 'approved');

-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews" 
ON public.reviews FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews" 
ON public.reviews FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Admins can do everything
CREATE POLICY "Admins can do everything with reviews" 
ON public.reviews FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Everyone can read review images for approved reviews
CREATE POLICY "Anyone can read review images for approved reviews" 
ON public.review_images FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.reviews 
    WHERE reviews.id = review_id AND reviews.status = 'approved'
  )
);

-- Authenticated users can add images to their reviews
CREATE POLICY "Authenticated users can add images to their reviews" 
ON public.review_images FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.reviews 
    WHERE reviews.id = review_id AND reviews.user_id = auth.uid()
  )
);

-- Everyone can read review responses
CREATE POLICY "Anyone can read review responses" 
ON public.review_responses FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.reviews 
    WHERE reviews.id = review_id AND reviews.status = 'approved'
  )
);

-- Only admins can create, update, delete review responses
CREATE POLICY "Admins can manage review responses" 
ON public.review_responses FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
