-- Add inventory management functions

-- Function to update product inventory after order completion
CREATE OR REPLACE FUNCTION update_product_inventory(
    product_id UUID,
    quantity_sold INTEGER
)
RETURNS VOID AS $$
BEGIN
    -- Update the stock_quantity by reducing it
    UPDATE products 
    SET 
        stock_quantity = GREATEST(0, stock_quantity - quantity_sold),
        updated_at = NOW()
    WHERE id = product_id;
    
    -- If stock reaches 0, optionally mark as out of stock
    UPDATE products 
    SET is_active = false
    WHERE id = product_id AND stock_quantity = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to restore inventory (for order cancellations)
CREATE OR REPLACE FUNCTION restore_product_inventory(
    product_id UUID,
    quantity_to_restore INTEGER
)
RETURNS VOID AS $$
BEGIN
    -- Restore the stock_quantity
    UPDATE products 
    SET 
        stock_quantity = stock_quantity + quantity_to_restore,
        is_active = true,
        updated_at = NOW()
    WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION update_product_inventory(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION restore_product_inventory(UUID, INTEGER) TO authenticated;