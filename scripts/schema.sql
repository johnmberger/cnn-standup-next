-- Database schema for standup leader application
-- 
-- NOTE: This SQL file is optional. Prisma handles migrations automatically.
-- Use this only if you need to manually create tables or understand the schema.
-- 
-- To use Prisma migrations instead:
-- 1. Run: npx prisma migrate dev --name init
-- 2. Run: npx tsx scripts/migrate-to-db.ts (to seed data)

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Standup assignments table
CREATE TABLE IF NOT EXISTS standup_assignments (
  id SERIAL PRIMARY KEY,
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  monday_date DATE NOT NULL,
  team_member_id INTEGER REFERENCES team_members(id) ON DELETE CASCADE,
  is_override BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(week_number, year)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_standup_assignments_date 
ON standup_assignments(year, week_number);

CREATE INDEX IF NOT EXISTS idx_standup_assignments_monday 
ON standup_assignments(monday_date);

CREATE INDEX IF NOT EXISTS idx_standup_assignments_member 
ON standup_assignments(team_member_id);

-- Optional: Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_team_members_updated_at 
BEFORE UPDATE ON team_members
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_standup_assignments_updated_at 
BEFORE UPDATE ON standup_assignments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
