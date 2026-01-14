# Database Migration Guide for Standup Leader

## Overview
This guide outlines the best approach for migrating the standup leader selection logic from JavaScript functions to a database-backed solution, optimized for Vercel deployment.

## Recommended Database: Prisma with Postgres

**Why Prisma with Postgres:**
- Type-safe database client with excellent TypeScript support
- Great developer experience with Prisma Studio for database management
- Works with any Postgres provider (Vercel Postgres, Supabase, Neon, etc.)
- Automatic migrations and schema management
- Excellent Next.js integration
- Can use Vercel Postgres or any other Postgres database

## Database Schema

### Option 1: Store Weekly Assignments (Recommended)
Store pre-calculated assignments for all weeks, allowing for manual overrides:

```sql
-- Team members table
CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Weekly assignments table
CREATE TABLE standup_assignments (
  id SERIAL PRIMARY KEY,
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  monday_date DATE NOT NULL,
  team_member_id INTEGER REFERENCES team_members(id),
  is_override BOOLEAN DEFAULT false, -- Manual override flag
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(week_number, year)
);

-- Index for fast lookups
CREATE INDEX idx_standup_assignments_date ON standup_assignments(year, week_number);
CREATE INDEX idx_standup_assignments_monday ON standup_assignments(monday_date);
```

### Option 2: Store Rotation Rules (Alternative)
Store the rotation logic and calculate on-demand:

```sql
-- Rotation configuration
CREATE TABLE rotation_config (
  id SERIAL PRIMARY KEY,
  start_week_offset INTEGER NOT NULL DEFAULT -34,
  rotation_order INTEGER[] NOT NULL, -- Array of team_member_ids
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Team members (same as above)
CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Overrides for specific weeks
CREATE TABLE standup_overrides (
  id SERIAL PRIMARY KEY,
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  team_member_id INTEGER REFERENCES team_members(id),
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(week_number, year)
);
```

## Implementation Steps

### 1. Set Up Prisma

1. **Install Prisma:**
   ```bash
   npm install @prisma/client prisma
   ```

2. **Initialize Prisma:**
   ```bash
   npx prisma init
   ```
   This creates a `prisma/schema.prisma` file. The schema is already provided in this project.

3. **Set Up Database Connection:**
   - Create a Postgres database (Vercel Postgres, Supabase, Neon, etc.)
   - Add `DATABASE_URL` environment variable:
     ```
     DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
     ```
   - If using Vercel Postgres, you can use `POSTGRES_PRISMA_URL` or `POSTGRES_URL` as your `DATABASE_URL`

4. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

5. **Run Migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

### 2. Prisma Schema

The schema is defined in `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model TeamMember {
  id        Int      @id @default(autoincrement())
  name      String   @unique @db.VarChar(100)
  email     String?  @db.VarChar(255)
  active    Boolean  @default(true)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  assignments StandupAssignment[]
  
  @@map("team_members")
}

model StandupAssignment {
  id            Int      @id @default(autoincrement())
  weekNumber    Int      @map("week_number")
  year          Int
  mondayDate    DateTime @map("monday_date") @db.Date
  teamMemberId Int      @map("team_member_id")
  isOverride    Boolean  @default(false) @map("is_override")
  notes         String?  @db.Text
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  
  teamMember TeamMember @relation(fields: [teamMemberId], references: [id], onDelete: Cascade)
  
  @@unique([weekNumber, year])
  @@index([year, weekNumber], name: "idx_standup_assignments_date")
  @@index([mondayDate], name: "idx_standup_assignments_monday")
  @@index([teamMemberId], name: "idx_standup_assignments_member")
  @@map("standup_assignments")
}
```

### 3. Database Utilities

The database utilities are in `src/lib/db.ts` and use Prisma Client:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getCurrentStandupLeaderFromDB(): Promise<string | null> {
  const assignment = await prisma.standupAssignment.findFirst({
    where: {
      weekNumber: getCurrentWeekNumber(),
      year: new Date().getFullYear(),
      teamMember: { active: true },
    },
    include: { teamMember: true },
  });
  
  return assignment?.teamMember.name || null;
}
```

### 3. Create API Routes

Create `src/app/api/standup-leader/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { getCurrentStandupLeaderFromDB, getNextStandupLeaderFromDB } from '@/lib/db';

export async function GET() {
  try {
    const [currentLeader, nextLeader] = await Promise.all([
      getCurrentStandupLeaderFromDB(),
      getNextStandupLeaderFromDB(),
    ]);
    
    return NextResponse.json({
      currentLeader,
      nextLeader,
    });
  } catch (error) {
    console.error('Error fetching standup leaders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch standup leaders' },
      { status: 500 }
    );
  }
}
```

### 4. Update Client Component

Modify `StandupLeaderClient.tsx` to fetch from API:

```typescript
'use client';

import { useState, useEffect } from 'react';
// ... other imports

export default function StandupLeaderClient() {
  const [currentLeader, setCurrentLeader] = useState<string>('');
  const [nextLeader, setNextLeader] = useState<string>('');
  // ... other state

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const response = await fetch('/api/standup-leader');
        const data = await response.json();
        setCurrentLeader(data.currentLeader || '');
        setNextLeader(data.nextLeader || '');
      } catch (error) {
        console.error('Error fetching leaders:', error);
        // Fallback to existing logic if DB fails
        setCurrentLeader(getCurrentStandupLeader());
        setNextLeader(getNextStandupLeader());
      }
    }
    
    fetchLeaders();
    setCurrentWeekDates(getCurrentWeekDates());
    setNextWeekDates(getNextWeekDates());
    setWeekNumber(getCurrentWeekNumber());
  }, []);

  // ... rest of component
}
```

### 5. Migration Script

The migration script is in `scripts/migrate-to-db.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import { TEAM_MEMBERS } from '../src/lib/standup';
import { initializeYearAssignments } from '../src/lib/db';

const prisma = new PrismaClient();

async function migrate() {
  // 1. Insert team members
  for (const name of TEAM_MEMBERS) {
    await prisma.teamMember.upsert({
      where: { name },
      update: {},
      create: { name, active: true },
    });
  }
  
  // 2. Initialize assignments for current year + next year
  const currentYear = new Date().getFullYear();
  await initializeYearAssignments(currentYear, TEAM_MEMBERS);
  await initializeYearAssignments(currentYear + 1, TEAM_MEMBERS);
  
  console.log('Migration complete!');
}

migrate().catch(console.error);
```

Run with:
```bash
npx tsx scripts/migrate-to-db.ts
```

## Deployment Considerations

### 1. Environment Variables
- Set `DATABASE_URL` in your Vercel project settings
- If using Vercel Postgres, you can use `POSTGRES_PRISMA_URL` or set `DATABASE_URL` to `POSTGRES_URL`
- For local development, add to `.env` file

### 2. Prisma Client Generation
- Prisma Client must be generated before building: `npx prisma generate`
- Add to your `package.json` build script:
  ```json
  "build": "prisma generate && next build"
  ```
- Or use a `postinstall` script:
  ```json
  "postinstall": "prisma generate"
  ```

### 3. Edge Runtime Compatibility
Prisma Client works in Node.js runtime. For Edge Runtime, you'd need to use raw SQL queries or a different approach.

### 3. Caching Strategy
- Use Next.js `revalidate` for ISR (Incremental Static Regeneration)
- Cache API responses for 1 hour (week changes weekly)
- Use `unstable_cache` for database queries

### 4. Fallback Strategy
Keep existing JavaScript logic as fallback if database is unavailable:

```typescript
export async function getCurrentStandupLeader(): Promise<string> {
  try {
    const dbLeader = await getCurrentStandupLeaderFromDB();
    if (dbLeader) return dbLeader;
  } catch (error) {
    console.error('DB error, using fallback:', error);
  }
  // Fallback to deterministic calculation
  return getCurrentStandupLeaderFromJS();
}
```

## Benefits of Database Approach

1. **Flexibility**: Easy to add/remove team members
2. **Overrides**: Handle special cases (sick leave, vacations)
3. **History**: Track who led when
4. **Admin UI**: Build interface to manage assignments
5. **Analytics**: Query rotation fairness, frequency per person

## Alternative: Hybrid Approach

Keep deterministic logic but use database for:
- Team member list (dynamic)
- Overrides for specific weeks
- Historical tracking

This gives you flexibility without pre-calculating everything.

## Cost Estimate

**Database Options:**
- **Vercel Postgres**: Free tier (256 MB storage, 60 hours compute/month) or Pro ($20/month)
- **Supabase**: Free tier (500 MB storage, 2 GB bandwidth)
- **Neon**: Free tier (3 GB storage, 512 MB compute)
- **PlanetScale**: Free tier (5 GB storage, 1 billion row reads/month)

For this use case, any free tier should be sufficient (very low data volume).

## Next Steps

1. **Install Prisma:**
   ```bash
   npm install @prisma/client prisma
   ```

2. **Set up database:**
   - Create a Postgres database (Vercel Postgres, Supabase, Neon, etc.)
   - Add `DATABASE_URL` environment variable

3. **Initialize Prisma:**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Seed database:**
   ```bash
   npx tsx scripts/migrate-to-db.ts
   ```

5. **Test locally:**
   ```bash
   npm run dev
   ```

6. **Deploy to Vercel:**
   - Ensure `DATABASE_URL` is set in Vercel environment variables
   - Add `prisma generate` to build process
   - Deploy!

## Useful Prisma Commands

- `npx prisma studio` - Open Prisma Studio to view/edit data
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema changes without migrations (dev only)
