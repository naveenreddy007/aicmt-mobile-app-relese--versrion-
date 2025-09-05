-- Grant permissions for analytics table
GRANT SELECT ON analytics TO anon;
GRANT ALL PRIVILEGES ON analytics TO authenticated;

-- Clear existing analytics data first
DELETE FROM analytics;

-- Insert sample analytics data for testing
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