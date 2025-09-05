-- Create quotations table for enhanced quotation management
-- Migration: 20241230_create_quotations_table

-- Create quotations table
CREATE TABLE IF NOT EXISTS quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    custom_order_id UUID NOT NULL REFERENCES custom_orders(id) ON DELETE CASCADE,
    bill_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    received_amount DECIMAL(12,2) DEFAULT 0,
    balance_amount DECIMAL(12,2) GENERATED ALWAYS AS (total_amount - received_amount) STORED,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'overdue')),
    payment_terms TEXT,
    line_items JSONB,
    valid_until DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_quotations_custom_order_id ON quotations(custom_order_id);
CREATE INDEX IF NOT EXISTS idx_quotations_bill_number ON quotations(bill_number);
CREATE INDEX IF NOT EXISTS idx_quotations_payment_status ON quotations(payment_status);
CREATE INDEX IF NOT EXISTS idx_quotations_valid_until ON quotations(valid_until);
CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON quotations(created_at DESC);

-- Create trigger for updated_at timestamp
CREATE TRIGGER set_quotations_updated_at
BEFORE UPDATE ON quotations
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Create sequence for bill numbers
CREATE SEQUENCE IF NOT EXISTS bill_number_seq START 1000;

-- Function to generate bill numbers
CREATE OR REPLACE FUNCTION generate_bill_number()
RETURNS VARCHAR(50) AS $$
DECLARE
    next_num INTEGER;
    bill_num VARCHAR(50);
BEGIN
    SELECT nextval('bill_number_seq') INTO next_num;
    bill_num := 'BILL-' || TO_CHAR(EXTRACT(YEAR FROM NOW()), 'YYYY') || '-' || LPAD(next_num::TEXT, 6, '0');
    RETURN bill_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate bill number
CREATE OR REPLACE FUNCTION set_bill_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.bill_number IS NULL OR NEW.bill_number = '' THEN
        NEW.bill_number := generate_bill_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quotations_bill_number_trigger
BEFORE INSERT ON quotations
FOR EACH ROW
EXECUTE FUNCTION set_bill_number();

-- Enable Row Level Security
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow admin to manage quotations
CREATE POLICY "Allow admin to manage quotations" 
ON quotations FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Grant permissions to authenticated role
GRANT ALL PRIVILEGES ON quotations TO authenticated;
GRANT USAGE ON SEQUENCE bill_number_seq TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE quotations IS 'Quotations for custom orders with bill tracking and payment management';
COMMENT ON COLUMN quotations.bill_number IS 'Auto-generated unique bill number in format BILL-YYYY-XXXXXX';
COMMENT ON COLUMN quotations.balance_amount IS 'Computed column: total_amount - received_amount';
COMMENT ON COLUMN quotations.line_items IS 'JSON array of quotation line items with descriptions and amounts';