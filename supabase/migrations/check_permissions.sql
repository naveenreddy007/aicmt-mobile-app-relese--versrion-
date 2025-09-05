-- Check current permissions for story tables
SELECT 
    grantee, 
    table_name, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
    AND grantee IN ('anon', 'authenticated') 
    AND table_name IN ('journey_milestones', 'team_members', 'achievements', 'impact_stories', 'gallery', 'media_library')
ORDER BY table_name, grantee;

-- Grant necessary permissions if missing
-- For anon role (public read access)
GRANT SELECT ON journey_milestones TO anon;
GRANT SELECT ON team_members TO anon;
GRANT SELECT ON achievements TO anon;
GRANT SELECT ON impact_stories TO anon;
GRANT SELECT ON gallery TO anon;
GRANT SELECT ON media_library TO anon;

-- For authenticated role (full access)
GRANT ALL PRIVILEGES ON journey_milestones TO authenticated;
GRANT ALL PRIVILEGES ON team_members TO authenticated;
GRANT ALL PRIVILEGES ON achievements TO authenticated;
GRANT ALL PRIVILEGES ON impact_stories TO authenticated;
GRANT ALL PRIVILEGES ON gallery TO authenticated;
GRANT ALL PRIVILEGES ON media_library TO authenticated;

-- Check permissions again after granting
SELECT 
    grantee, 
    table_name, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
    AND grantee IN ('anon', 'authenticated') 
    AND table_name IN ('journey_milestones', 'team_members', 'achievements', 'impact_stories', 'gallery', 'media_library')
ORDER BY table_name, grantee;