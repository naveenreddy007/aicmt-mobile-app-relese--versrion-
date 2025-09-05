-- Create function to update quotation payment amounts
CREATE OR REPLACE FUNCTION update_quotation_payment(
  quotation_id UUID,
  payment_amount NUMERIC
)
RETURNS VOID AS $$
BEGIN
  -- Update the received_amount by adding the payment_amount
  UPDATE quotations 
  SET 
    received_amount = COALESCE(received_amount, 0) + payment_amount,
    updated_at = NOW()
  WHERE id = quotation_id;
  
  -- Update payment status based on balance
  UPDATE quotations 
  SET payment_status = CASE 
    WHEN received_amount >= total_amount THEN 'paid'
    WHEN received_amount > 0 THEN 'partial'
    ELSE 'pending'
  END
  WHERE id = quotation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION update_quotation_payment(UUID, NUMERIC) TO authenticated;
GRANT EXECUTE ON FUNCTION update_quotation_payment(UUID, NUMERIC) TO anon;

-- Create trigger to automatically update payment status when received_amount changes
CREATE OR REPLACE FUNCTION update_payment_status_trigger()
RETURNS TRIGGER AS $$
BEGIN
  NEW.payment_status = CASE 
    WHEN NEW.received_amount >= NEW.total_amount THEN 'paid'
    WHEN NEW.received_amount > 0 THEN 'partial'
    ELSE 'pending'
  END;
  
  NEW.updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS quotation_payment_status_trigger ON quotations;

-- Create trigger
CREATE TRIGGER quotation_payment_status_trigger
  BEFORE UPDATE OF received_amount, total_amount ON quotations
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_status_trigger();

-- Grant permissions for the payments table
GRANT SELECT, INSERT, UPDATE, DELETE ON payments TO authenticated;
GRANT SELECT ON payments TO anon;

-- Grant permissions for the quotations table
GRANT SELECT, UPDATE ON quotations TO authenticated;
GRANT SELECT ON quotations TO anon;