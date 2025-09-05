-- Create custom_orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.custom_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    product_type TEXT NOT NULL, -- 'bags', 'packaging', 'films'
    product_name TEXT NOT NULL,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    thickness TEXT NOT NULL,
    printing_option TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    timeline TEXT NOT NULL, -- 'urgent', 'standard', 'relaxed'
    logo_url TEXT,
    print_location TEXT,
    special_instructions TEXT,
    additional_requirements TEXT,
    status TEXT NOT NULL DEFAULT 'new', -- 'new', 'reviewing', 'quoted', 'in-production', 'completed', 'cancelled'
    assigned_to UUID REFERENCES public.profiles(id),
    quote_amount DECIMAL(10,2),
    quote_sent_at TIMESTAMP WITH TIME ZONE,
    quote_valid_until TIMESTAMP WITH TIME ZONE,
    quote_notes TEXT,
    quote_reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add trigger for updated_at
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'set_custom_orders_updated_at'
    ) THEN
        CREATE TRIGGER set_custom_orders_updated_at
        BEFORE UPDATE ON public.custom_orders
        FOR EACH ROW
        EXECUTE FUNCTION public.set_updated_at();
    END IF;
END
$$;

-- Add RLS policies
ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (create an order)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polname = 'Allow anyone to insert custom orders'
    ) THEN
        CREATE POLICY "Allow anyone to insert custom orders" 
        ON public.custom_orders FOR INSERT 
        TO authenticated, anon
        WITH CHECK (true);
    END IF;
END
$$;

-- Allow authenticated users to view their own orders
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polname = 'Allow users to view their own orders'
    ) THEN
        CREATE POLICY "Allow users to view their own orders" 
        ON public.custom_orders FOR SELECT 
        TO authenticated
        USING (email = auth.jwt() ->> 'email');
    END IF;
END
$$;

-- Allow admin to view all orders
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polname = 'Allow admin to view all orders'
    ) THEN
        CREATE POLICY "Allow admin to view all orders" 
        ON public.custom_orders FOR SELECT 
        TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
          )
        );
    END IF;
END
$$;

-- Allow admin to update all orders
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polname = 'Allow admin to update all orders'
    ) THEN
        CREATE POLICY "Allow admin to update all orders" 
        ON public.custom_orders FOR UPDATE
        TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
          )
        );
    END IF;
END
$$;
