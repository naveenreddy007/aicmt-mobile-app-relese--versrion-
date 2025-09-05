-- Add enhanced address fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS state VARCHAR(100),
ADD COLUMN IF NOT EXISTS zip_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS country VARCHAR(2) DEFAULT 'US';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(city, state, country);

-- Update existing profiles with default country if null
UPDATE profiles SET country = 'US' WHERE country IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN profiles.city IS 'User city';
COMMENT ON COLUMN profiles.state IS 'User state or province';
COMMENT ON COLUMN profiles.zip_code IS 'User ZIP or postal code';
COMMENT ON COLUMN profiles.country IS 'User country code (ISO 3166-1 alpha-2)';