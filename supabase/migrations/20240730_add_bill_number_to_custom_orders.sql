-- Add bill_number column to custom_orders table
ALTER TABLE custom_orders 
ADD COLUMN bill_number VARCHAR(50) UNIQUE;

-- Create index for better performance on bill_number lookups
CREATE INDEX idx_custom_orders_bill_number ON custom_orders(bill_number);

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS generate_bill_number();

-- Create a function to generate the next bill number
CREATE OR REPLACE FUNCTION generate_bill_number()
RETURNS TEXT AS $$
DECLARE
    current_year INTEGER;
    next_sequence INTEGER;
    bill_number TEXT;
BEGIN
    -- Get current year
    current_year := EXTRACT(YEAR FROM CURRENT_DATE);
    
    -- Get the next sequence number for this year
    SELECT COALESCE(MAX(
        CAST(
            SUBSTRING(
                bill_number FROM 'BILL-' || current_year || '-(\d+)'
            ) AS INTEGER
        )
    ), 0) + 1
    INTO next_sequence
    FROM custom_orders
    WHERE bill_number LIKE 'BILL-' || current_year || '-%';
    
    -- Format the bill number with zero padding
    bill_number := 'BILL-' || current_year || '-' || LPAD(next_sequence::TEXT, 3, '0');
    
    RETURN bill_number;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION generate_bill_number() TO authenticated;
GRANT EXECUTE ON FUNCTION generate_bill_number() TO anon;

-- Update existing custom orders to have bill numbers (optional - only if you want to backfill)
-- UPDATE custom_orders 
-- SET bill_number = generate_bill_number() 
-- WHERE bill_number IS NULL;