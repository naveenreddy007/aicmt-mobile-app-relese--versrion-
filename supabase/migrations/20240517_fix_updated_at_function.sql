-- Create the missing set_updated_at function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Check if any triggers are using this function and recreate them if needed
DO $$
DECLARE
    trigger_record RECORD;
BEGIN
    FOR trigger_record IN 
        SELECT tgname, relname 
        FROM pg_trigger
        JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
        WHERE tgfoid = (SELECT oid FROM pg_proc WHERE proname = 'set_updated_at')
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', 
                      trigger_record.tgname, 
                      trigger_record.relname);
        
        EXECUTE format('CREATE TRIGGER %I 
                       BEFORE UPDATE ON %I 
                       FOR EACH ROW 
                       EXECUTE FUNCTION set_updated_at()', 
                       trigger_record.tgname, 
                       trigger_record.relname);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for tables that should have updated_at functionality
-- but might not have it yet
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        -- Check if the table already has an updated_at trigger
        IF NOT EXISTS (
            SELECT 1 
            FROM pg_trigger 
            JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
            WHERE pg_class.relname = table_record.table_name
            AND (tgfoid = (SELECT oid FROM pg_proc WHERE proname = 'set_updated_at')
                 OR tgfoid = (SELECT oid FROM pg_proc WHERE proname = 'update_updated_at'))
        ) THEN
            -- Create the trigger if it doesn't exist
            EXECUTE format('CREATE TRIGGER set_%I_updated_at 
                           BEFORE UPDATE ON %I 
                           FOR EACH ROW 
                           EXECUTE FUNCTION set_updated_at()', 
                           table_record.table_name,
                           table_record.table_name);
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
