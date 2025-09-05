-- Enhance inquiries table with flexible product association
-- Migration: 20241230_enhance_inquiries_table

-- Add flexible product association fields to inquiries table
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id);
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS product_details JSONB;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS has_specific_product BOOLEAN DEFAULT true;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent'));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_inquiries_product_id ON inquiries(product_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_has_specific_product ON inquiries(has_specific_product);
CREATE INDEX IF NOT EXISTS idx_inquiries_priority ON inquiries(priority);
CREATE INDEX IF NOT EXISTS idx_inquiries_status_priority ON inquiries(status, priority);

-- Update existing inquiries to set has_specific_product based on product_interest
UPDATE inquiries 
SET has_specific_product = CASE 
    WHEN product_interest IS NOT NULL AND product_interest != '' THEN true
    ELSE false
END
WHERE has_specific_product IS NULL;

-- Function to automatically set product_id from product_interest if it's a valid UUID
CREATE OR REPLACE FUNCTION set_inquiry_product_id()
RETURNS TRIGGER AS $$
BEGIN
    -- If product_interest looks like a UUID, try to set product_id
    IF NEW.product_interest IS NOT NULL AND 
       NEW.product_interest ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
        
        -- Check if this UUID exists in products table
        IF EXISTS (SELECT 1 FROM products WHERE id = NEW.product_interest::UUID) THEN
            NEW.product_id := NEW.product_interest::UUID;
            NEW.has_specific_product := true;
        END IF;
    END IF;
    
    -- Set has_specific_product based on whether we have product info
    IF NEW.has_specific_product IS NULL THEN
        NEW.has_specific_product := (NEW.product_id IS NOT NULL OR 
                                   (NEW.product_interest IS NOT NULL AND NEW.product_interest != ''));
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set product_id
CREATE TRIGGER inquiries_set_product_id_trigger
BEFORE INSERT OR UPDATE ON inquiries
FOR EACH ROW
EXECUTE FUNCTION set_inquiry_product_id();

-- Add comments for documentation
COMMENT ON COLUMN inquiries.product_id IS 'Reference to specific product if inquiry is about a particular product';
COMMENT ON COLUMN inquiries.product_details IS 'JSON object containing custom product specifications when has_specific_product is false';
COMMENT ON COLUMN inquiries.has_specific_product IS 'Whether inquiry is about a specific existing product or general/custom inquiry';
COMMENT ON COLUMN inquiries.priority IS 'Inquiry priority level for admin processing';