-- Create Stories System Tables
-- This migration creates tables for managing "Our Stories" content including journey, team, achievements, and impact

-- Journey Milestones Table
CREATE TABLE IF NOT EXISTS journey_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    description TEXT,
    image_url VARCHAR(500),
    category VARCHAR(100) DEFAULT 'team', -- leadership, team, advisors, etc.
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    year VARCHAR(10),
    category VARCHAR(100), -- certification, award, milestone, etc.
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Impact Stories Table
CREATE TABLE IF NOT EXISTS impact_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    stats VARCHAR(255), -- e.g., "50+ awareness workshops conducted"
    category VARCHAR(100), -- environmental, social, economic, etc.
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_journey_milestones_active_order ON journey_milestones(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_team_members_active_category_order ON team_members(is_active, category, display_order);
CREATE INDEX IF NOT EXISTS idx_achievements_active_category_order ON achievements(is_active, category, display_order);
CREATE INDEX IF NOT EXISTS idx_impact_stories_active_category_order ON impact_stories(is_active, category, display_order);

-- Enable Row Level Security (RLS)
ALTER TABLE journey_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_stories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Allow public read access to active journey milestones" ON journey_milestones
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read access to active team members" ON team_members
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read access to active achievements" ON achievements
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read access to active impact stories" ON impact_stories
    FOR SELECT USING (is_active = true);

-- Create RLS policies for authenticated admin access
CREATE POLICY "Allow authenticated users full access to journey milestones" ON journey_milestones
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users full access to team members" ON team_members
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users full access to achievements" ON achievements
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users full access to impact stories" ON impact_stories
    FOR ALL USING (auth.uid() IS NOT NULL);