-- Add Amazon integration fields to products table
-- Migration: 20241230_add_amazon_integration_to_products

-- Add Amazon URL and related fields to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS amazon_url VARCHAR(500);
ALTER TABLE products ADD COLUMN IF NOT EXISTS amazon_enabled BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS inquiry_enabled BOOLEAN DEFAULT true;

-- Create index for Amazon enabled products for better query performance
CREATE INDEX IF NOT EXISTS idx_products_amazon_enabled ON products(amazon_enabled) WHERE amazon_enabled = true;

-- Create index for inquiry enabled products
CREATE INDEX IF NOT EXISTS idx_products_inquiry_enabled ON products(inquiry_enabled) WHERE inquiry_enabled = true;

-- Update existing products to enable inquiries by default
UPDATE products SET inquiry_enabled = true WHERE inquiry_enabled IS NULL;

-- Add comment to document the purpose of new columns
COMMENT ON COLUMN products.amazon_url IS 'Amazon product URL for direct purchase option';
COMMENT ON COLUMN products.amazon_enabled IS 'Whether Amazon purchase option is available for this product';
COMMENT ON COLUMN products.inquiry_enabled IS 'Whether customers can make inquiries about this product';