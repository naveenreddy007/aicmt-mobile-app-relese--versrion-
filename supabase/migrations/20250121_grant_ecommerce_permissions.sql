-- Grant permissions for e-commerce tables to anon and authenticated roles
-- This ensures proper access control for cart and order operations

-- Grant permissions for cart_items table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;
GRANT SELECT ON public.cart_items TO anon;

-- Grant permissions for orders table
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT SELECT ON public.orders TO anon;

-- Grant permissions for order_items table
GRANT SELECT, INSERT, UPDATE ON public.order_items TO authenticated;
GRANT SELECT ON public.order_items TO anon;

-- Grant usage on sequences (if any)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Ensure authenticated users can execute the order number generation function
GRANT EXECUTE ON FUNCTION public.generate_order_number() TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_order_number() TO anon;

-- Ensure authenticated users can execute the custom order bill number function
GRANT EXECUTE ON FUNCTION public.set_custom_order_bill_number() TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_custom_order_bill_number() TO anon;

-- Permissions granted successfully
-- authenticated users have full access to their cart items and orders
-- anon users have read access for guest checkout functionality