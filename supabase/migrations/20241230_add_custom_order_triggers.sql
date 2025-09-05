-- Add triggers for custom order status changes and quotation automation
-- Migration: 20241230_add_custom_order_triggers

-- Function to handle custom order status changes
CREATE OR REPLACE FUNCTION handle_custom_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- When status changes to 'quoted', create quotation if not exists
    IF NEW.status = 'quoted' AND OLD.status != 'quoted' AND NEW.quote_amount IS NOT NULL THEN
        INSERT INTO quotations (custom_order_id, total_amount, payment_terms, valid_until)
        VALUES (
            NEW.id, 
            NEW.quote_amount, 
            'Payment due within 30 days',
            CURRENT_DATE + INTERVAL '30 days'
        )
        ON CONFLICT (custom_order_id) DO UPDATE SET
            total_amount = EXCLUDED.total_amount,
            updated_at = NOW();
    END IF;
    
    -- Update quote_sent_at timestamp when status becomes 'quoted'
    IF NEW.status = 'quoted' AND OLD.status != 'quoted' THEN
        NEW.quote_sent_at := NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for custom order status changes
DROP TRIGGER IF EXISTS custom_order_status_change_trigger ON custom_orders;
CREATE TRIGGER custom_order_status_change_trigger
AFTER UPDATE OF status ON custom_orders
FOR EACH ROW
EXECUTE FUNCTION handle_custom_order_status_change();

-- Function to sync quotation total with custom order quote_amount
CREATE OR REPLACE FUNCTION sync_quotation_with_custom_order()
RETURNS TRIGGER AS $$
BEGIN
    -- Update quotation total_amount when custom order quote_amount changes
    IF NEW.quote_amount IS NOT NULL AND NEW.quote_amount != OLD.quote_amount THEN
        UPDATE quotations 
        SET total_amount = NEW.quote_amount,
            updated_at = NOW()
        WHERE custom_order_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to sync quotation amounts
CREATE TRIGGER sync_quotation_amount_trigger
AFTER UPDATE OF quote_amount ON custom_orders
FOR EACH ROW
EXECUTE FUNCTION sync_quotation_with_custom_order();

-- Add unique constraint to ensure one quotation per custom order
ALTER TABLE quotations ADD CONSTRAINT unique_quotation_per_order UNIQUE (custom_order_id);

-- Add comments for documentation
COMMENT ON FUNCTION handle_custom_order_status_change() IS 'Automatically creates quotation when custom order status changes to quoted';
COMMENT ON FUNCTION sync_quotation_with_custom_order() IS 'Keeps quotation total_amount in sync with custom order quote_amount';