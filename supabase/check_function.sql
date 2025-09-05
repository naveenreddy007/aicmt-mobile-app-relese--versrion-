-- Check if the function exists and create it if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'set_updated_at') THEN
        CREATE FUNCTION set_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        RAISE NOTICE 'Created set_updated_at() function';
    ELSE
        RAISE NOTICE 'set_updated_at() function already exists';
    END IF;
END;
$$ LANGUAGE plpgsql;
