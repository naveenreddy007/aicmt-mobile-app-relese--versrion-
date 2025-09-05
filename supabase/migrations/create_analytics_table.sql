-- Drop existing analytics table if it exists
DROP TABLE IF EXISTS analytics CASCADE;

-- Create analytics table with correct structure for the application
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    visitors INTEGER NOT NULL DEFAULT 0,
    pageviews INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index on date to prevent duplicates
CREATE UNIQUE INDEX idx_analytics_date ON analytics(date);

-- Enable RLS
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT ON analytics TO anon;
GRANT ALL PRIVILEGES ON analytics TO authenticated;

-- Create policies
CREATE POLICY "Public can view analytics" ON analytics
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage analytics" ON analytics
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample data for the last 30 days
INSERT INTO analytics (date, visitors, pageviews) VALUES
  (CURRENT_DATE - INTERVAL '30 days', 150, 450),
  (CURRENT_DATE - INTERVAL '29 days', 180, 520),
  (CURRENT_DATE - INTERVAL '28 days', 200, 600),
  (CURRENT_DATE - INTERVAL '27 days', 175, 525),
  (CURRENT_DATE - INTERVAL '26 days', 220, 660),
  (CURRENT_DATE - INTERVAL '25 days', 190, 570),
  (CURRENT_DATE - INTERVAL '24 days', 210, 630),
  (CURRENT_DATE - INTERVAL '23 days', 185, 555),
  (CURRENT_DATE - INTERVAL '22 days', 195, 585),
  (CURRENT_DATE - INTERVAL '21 days', 225, 675),
  (CURRENT_DATE - INTERVAL '20 days', 240, 720),
  (CURRENT_DATE - INTERVAL '19 days', 205, 615),
  (CURRENT_DATE - INTERVAL '18 days', 230, 690),
  (CURRENT_DATE - INTERVAL '17 days', 215, 645),
  (CURRENT_DATE - INTERVAL '16 days', 250, 750),
  (CURRENT_DATE - INTERVAL '15 days', 235, 705),
  (CURRENT_DATE - INTERVAL '14 days', 260, 780),
  (CURRENT_DATE - INTERVAL '13 days', 245, 735),
  (CURRENT_DATE - INTERVAL '12 days', 270, 810),
  (CURRENT_DATE - INTERVAL '11 days', 255, 765),
  (CURRENT_DATE - INTERVAL '10 days', 280, 840),
  (CURRENT_DATE - INTERVAL '9 days', 265, 795),
  (CURRENT_DATE - INTERVAL '8 days', 290, 870),
  (CURRENT_DATE - INTERVAL '7 days', 275, 825),
  (CURRENT_DATE - INTERVAL '6 days', 300, 900),
  (CURRENT_DATE - INTERVAL '5 days', 285, 855),
  (CURRENT_DATE - INTERVAL '4 days', 310, 930),
  (CURRENT_DATE - INTERVAL '3 days', 295, 885),
  (CURRENT_DATE - INTERVAL '2 days', 320, 960),
  (CURRENT_DATE - INTERVAL '1 day', 305, 915),
  (CURRENT_DATE, 330, 990);

-- Create trigger for updated_at
CREATE TRIGGER update_analytics_updated_at
BEFORE UPDATE ON analytics
FOR EACH ROW EXECUTE FUNCTION update_updated_at();