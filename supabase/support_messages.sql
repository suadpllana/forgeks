-- ============================================================
-- Run in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS support_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name        text NOT NULL,
  email       text NOT NULL,
  subject     text NOT NULL DEFAULT 'General Inquiry',
  message     text NOT NULL,
  status      text NOT NULL DEFAULT 'open',   -- open | in_progress | resolved
  admin_notes text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_updated_at ON support_messages;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON support_messages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Anyone can insert (contact form), only admins can read/update via RLS
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

-- Public insert (contact form submissions)
CREATE POLICY "Allow public insert" ON support_messages
  FOR INSERT WITH CHECK (true);

-- Only authenticated users with admin role can select / update
CREATE POLICY "Admin select" ON support_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin update" ON support_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
