-- Create newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    is_subscribed BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    source TEXT, -- e.g., 'footer', 'popup', 'landing_page'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert their own subscription"
ON newsletter_subscriptions FOR INSERT
WITH CHECK (TRUE); -- Simplistic for now, might need refinement for auth users

CREATE POLICY "Users can update their own subscription status (e.g. unsubscribe)"
ON newsletter_subscriptions FOR UPDATE
USING (auth.uid() IS NOT NULL AND email = (SELECT email FROM profiles WHERE id = auth.uid())) -- Example if linking to profiles
WITH CHECK (auth.uid() IS NOT NULL AND email = (SELECT email FROM profiles WHERE id = auth.uid())); -- Or a more generic token-based approach for unauthenticated unsubscribe

CREATE POLICY "Admins can manage all subscriptions"
ON newsletter_subscriptions FOR ALL
USING (public.is_admin(auth.uid())); -- Assuming is_admin function exists

-- Trigger to update 'updated_at' timestamp
CREATE TRIGGER handle_newsletter_subscriptions_updated_at
BEFORE UPDATE ON newsletter_subscriptions
FOR EACH ROW
EXECUTE FUNCTION moddatetime (updated_at);

COMMENT ON TABLE newsletter_subscriptions IS 'Stores email addresses for newsletter subscriptions.';
COMMENT ON COLUMN newsletter_subscriptions.email IS 'The email address of the subscriber.';
COMMENT ON COLUMN newsletter_subscriptions.is_subscribed IS 'Indicates if the user is currently subscribed.';
COMMENT ON COLUMN newsletter_subscriptions.subscribed_at IS 'Timestamp when the user subscribed.';
COMMENT ON COLUMN newsletter_subscriptions.unsubscribed_at IS 'Timestamp when the user unsubscribed.';
COMMENT ON COLUMN newsletter_subscriptions.source IS 'The source from where the subscription originated.';
