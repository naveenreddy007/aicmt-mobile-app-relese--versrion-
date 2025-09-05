-- Check if custom_orders table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'custom_orders'
) AS table_exists;

-- If it exists, show the table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'custom_orders'
ORDER BY ordinal_position;
