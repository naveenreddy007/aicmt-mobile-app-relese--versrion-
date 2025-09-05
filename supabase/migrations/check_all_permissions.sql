-- Check current permissions for all story tables
SELECT 
    grantee, 
    table_name, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
    AND grantee IN ('anon', 'authenticated') 
    AND table_name IN ('journey_milestones', 'team_members', 'achievements', 'impact_stories', 'gallery')
ORDER BY table_name, grantee;

-- Also check if there are any RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
    AND tablename IN ('journey_milestones', 'team_members', 'achievements', 'impact_stories', 'gallery')
ORDER BY tablename, policyname;