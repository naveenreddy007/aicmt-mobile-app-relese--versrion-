-- Add quotation_history table
CREATE TABLE IF NOT EXISTS quotation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quotation_id UUID REFERENCES quotations(id) ON DELETE CASCADE,
    custom_order_id UUID REFERENCES custom_orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policy for quotation_history table
ALTER TABLE quotation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage quotation history" ON quotation_history
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role_id = (SELECT id FROM roles WHERE name = 'admin')));