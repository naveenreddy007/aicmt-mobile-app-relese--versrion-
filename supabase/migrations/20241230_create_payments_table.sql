-- Create payments table for payment tracking
-- Migration: 20241230_create_payments_table

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    reference_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_payments_quotation_id ON payments(quotation_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date DESC);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_reference_number ON payments(reference_number) WHERE reference_number IS NOT NULL;

-- Function to update quotation received amount when payment is added/updated
CREATE OR REPLACE FUNCTION update_quotation_received_amount()
RETURNS TRIGGER AS $$
BEGIN
    -- Update received_amount in quotations table
    UPDATE quotations 
    SET received_amount = (
        SELECT COALESCE(SUM(amount), 0) 
        FROM payments 
        WHERE quotation_id = COALESCE(NEW.quotation_id, OLD.quotation_id)
        AND status = 'completed'
    )
    WHERE id = COALESCE(NEW.quotation_id, OLD.quotation_id);
    
    -- Update payment status based on balance
    UPDATE quotations 
    SET payment_status = CASE 
        WHEN balance_amount <= 0 THEN 'paid'
        WHEN received_amount > 0 THEN 'partial'
        ELSE 'pending'
    END
    WHERE id = COALESCE(NEW.quotation_id, OLD.quotation_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers to update quotation amounts when payments change
CREATE TRIGGER payments_update_quotation_trigger
AFTER INSERT OR UPDATE OR DELETE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_quotation_received_amount();

-- Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow admin to manage payments
CREATE POLICY "Allow admin to manage payments" 
ON payments FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Grant permissions to authenticated role
GRANT ALL PRIVILEGES ON payments TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE payments IS 'Payment records for quotations with automatic balance calculation';
COMMENT ON COLUMN payments.payment_method IS 'Method of payment (cash, check, bank_transfer, credit_card, etc.)';
COMMENT ON COLUMN payments.reference_number IS 'External reference number (check number, transaction ID, etc.)';
COMMENT ON COLUMN payments.status IS 'Payment status: pending, completed, failed, or refunded';