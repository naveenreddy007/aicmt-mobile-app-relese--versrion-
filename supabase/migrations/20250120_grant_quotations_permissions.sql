GRANT ALL PRIVILEGES ON quotations TO authenticated;
GRANT SELECT, INSERT ON quotations TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
