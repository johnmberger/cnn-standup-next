/**
 * Migration script to set up database tables and initial data using Prisma
 * 
 * To run:
 * 1. Ensure DATABASE_URL is set in your environment
 * 2. Run: npx prisma migrate dev --name init
 * 3. Run: npx tsx scripts/migrate-to-db.ts
 * 
 * Or add to package.json:
 * "scripts": {
 *   "migrate": "tsx scripts/migrate-to-db.ts",
 *   "db:seed": "tsx scripts/migrate-to-db.ts"
 * }
 */

import { PrismaClient } from '@prisma/client';
import { TEAM_MEMBERS } from '../src/lib/standup';
import { initializeYearAssignments } from '../src/lib/db';

const prisma = new PrismaClient();

async function migrate() {
  console.log('Starting database migration...');
  
  try {
    // 1. Insert team members
    console.log('Inserting team members...');
    let insertedCount = 0;
    for (const name of TEAM_MEMBERS) {
      try {
        await prisma.teamMember.upsert({
          where: { name },
          update: {}, // Don't update if exists
          create: {
            name,
            active: true,
          },
        });
        insertedCount++;
      } catch (error) {
        console.warn(`Warning: Could not insert ${name}:`, error);
      }
    }
    console.log(`✓ Inserted/updated ${insertedCount} team members`);
    
    // 2. Initialize assignments for current year and next year
    const currentYear = new Date().getFullYear();
    console.log(`Initializing assignments for year ${currentYear}...`);
    await initializeYearAssignments(currentYear, TEAM_MEMBERS);
    console.log(`✓ Year ${currentYear} initialized`);
    
    console.log(`Initializing assignments for year ${currentYear + 1}...`);
    await initializeYearAssignments(currentYear + 1, TEAM_MEMBERS);
    console.log(`✓ Year ${currentYear + 1} initialized`);
    
    // 3. Verify data
    const memberCount = await prisma.teamMember.count({
      where: { active: true },
    });
    const assignmentCount = await prisma.standupAssignment.count();
    
    console.log('\n✓ Migration complete!');
    console.log(`  - Team members: ${memberCount}`);
    console.log(`  - Assignments: ${assignmentCount}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrate()
  .then(() => {
    console.log('\nMigration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration error:', error);
    process.exit(1);
  });
