/**
 * Database implementation for standup leader selection using Prisma
 * 
 * Prerequisites:
 * 1. Install: npm install @prisma/client prisma
 * 2. Set up DATABASE_URL environment variable
 * 3. Run: npx prisma generate
 * 4. Run: npx prisma migrate dev (or use migration script)
 */

import { PrismaClient } from '@prisma/client';
import { getCurrentWeekNumber } from './standup';
import { getWorkDays } from './holidays';

// Prisma Client singleton pattern for Next.js
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export interface TeamMember {
  id: number;
  name: string;
  email?: string | null;
  active: boolean;
}

export interface StandupAssignment {
  id: number;
  weekNumber: number;
  year: number;
  mondayDate: Date;
  teamMemberId: number;
  teamMemberName: string;
  isOverride: boolean;
  notes?: string | null;
}

/**
 * Get the current week's standup leader from database
 */
export async function getCurrentStandupLeaderFromDB(): Promise<string | null> {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const weekNumber = getCurrentWeekNumber();
    
    const assignment = await prisma.standupAssignment.findFirst({
      where: {
        weekNumber,
        year,
        teamMember: {
          active: true,
        },
      },
      include: {
        teamMember: true,
      },
    });
    
    return assignment?.teamMember.name || null;
  } catch (error) {
    console.error('Error fetching current standup leader:', error);
    return null;
  }
}

/**
 * Get next week's standup leader from database
 */
export async function getNextStandupLeaderFromDB(): Promise<string | null> {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const currentWeek = getCurrentWeekNumber();
    const nextWeekNumber = currentWeek + 1;
    
    // Handle year boundary
    let nextYear = year;
    let weekToQuery = nextWeekNumber;
    if (nextWeekNumber > 52) {
      nextYear = year + 1;
      weekToQuery = 1; // Start of next year
    }
    
    const assignment = await prisma.standupAssignment.findFirst({
      where: {
        weekNumber: weekToQuery,
        year: nextYear,
        teamMember: {
          active: true,
        },
      },
      include: {
        teamMember: true,
      },
    });
    
    return assignment?.teamMember.name || null;
  } catch (error) {
    console.error('Error fetching next standup leader:', error);
    return null;
  }
}

/**
 * Get all active team members
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const members = await prisma.teamMember.findMany({
      where: {
        active: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    
    return members.map((member: TeamMember) => ({
      id: member.id,
      name: member.name,
      email: member.email,
      active: member.active,
    }));
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

/**
 * Add a team member
 */
export async function addTeamMember(name: string, email?: string): Promise<TeamMember | null> {
  try {
    const member = await prisma.teamMember.create({
      data: {
        name,
        email: email || null,
      },
    });
    
    return {
      id: member.id,
      name: member.name,
      email: member.email,
      active: member.active,
    };
  } catch (error) {
    console.error('Error adding team member:', error);
    return null;
  }
}

/**
 * Override assignment for a specific week
 */
export async function overrideWeekAssignment(
  weekNumber: number,
  year: number,
  teamMemberId: number,
  reason?: string
): Promise<boolean> {
  try {
    const mondayDate = getMondayDateForWeek(weekNumber, year);
    
    await prisma.standupAssignment.upsert({
      where: {
        weekNumber_year: {
          weekNumber,
          year,
        },
      },
      update: {
        teamMemberId,
        isOverride: true,
        notes: reason || null,
      },
      create: {
        weekNumber,
        year,
        mondayDate,
        teamMemberId,
        isOverride: true,
        notes: reason || null,
      },
    });
    
    return true;
  } catch (error) {
    console.error('Error overriding assignment:', error);
    return false;
  }
}

/**
 * Calculate and store assignments for a full year
 * This uses the existing rotation logic to pre-populate the database
 */
export async function initializeYearAssignments(
  year: number,
  teamMemberNames: string[]
): Promise<void> {
  try {
    // Get team member IDs
    const members = await prisma.teamMember.findMany({
      where: {
        name: {
          in: teamMemberNames,
        },
      },
    });
    
    const memberMap = new Map(
      members.map((member: TeamMember) => [member.name, member.id])
    );
    
    // Calculate all weeks for the year
    const firstMonday = getFirstMondayOfYear(year);
    const assignments: Array<{
      weekNumber: number;
      mondayDate: Date;
      leaderName: string;
    }> = [];
    
    // Generate assignments for all 52 weeks
    for (let week = 0; week < 52; week++) {
      const mondayDate = new Date(firstMonday);
      mondayDate.setDate(firstMonday.getDate() + week * 7);
      
      // Check if there are work days this week
      const fridayDate = new Date(mondayDate);
      fridayDate.setDate(mondayDate.getDate() + 4);
      const workDays = getWorkDays(mondayDate, fridayDate);
      
      if (workDays.length > 0) {
        // Use existing rotation logic
        const leaderIndex = ((week - 34) % teamMemberNames.length + teamMemberNames.length) % teamMemberNames.length;
        const leaderName = teamMemberNames[leaderIndex];
        
        assignments.push({
          weekNumber: week + 1,
          mondayDate,
          leaderName,
        });
      }
    }
    
    // Insert assignments (using upsert to handle duplicates)
    for (const assignment of assignments) {
      const memberId = memberMap.get(assignment.leaderName);
      if (memberId) {
        await prisma.standupAssignment.upsert({
          where: {
            weekNumber_year: {
              weekNumber: assignment.weekNumber,
              year,
            },
          },
          update: {}, // Don't update if exists
          create: {
            weekNumber: assignment.weekNumber,
            year,
            mondayDate: assignment.mondayDate,
            teamMemberId: memberId,
          },
        });
      }
    }
  } catch (error) {
    console.error('Error initializing year assignments:', error);
    throw error;
  }
}

/**
 * Helper: Get first Monday of a year
 */
function getFirstMondayOfYear(year: number): Date {
  const startOfYear = new Date(year, 0, 1);
  startOfYear.setHours(0, 0, 0, 0);
  const startDay = startOfYear.getDay();
  const daysToFirstMonday = startDay === 0 ? 1 : 8 - startDay;
  const firstMonday = new Date(startOfYear);
  firstMonday.setDate(startOfYear.getDate() + daysToFirstMonday);
  return firstMonday;
}

/**
 * Helper: Get Monday date for a given week number and year
 */
function getMondayDateForWeek(weekNumber: number, year: number): Date {
  const firstMonday = getFirstMondayOfYear(year);
  const mondayDate = new Date(firstMonday);
  mondayDate.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);
  return mondayDate;
}

/**
 * Get assignment history for a team member
 */
export async function getMemberHistory(teamMemberId: number, limit: number = 10): Promise<StandupAssignment[]> {
  try {
    const assignments = await prisma.standupAssignment.findMany({
      where: {
        teamMemberId,
      },
      include: {
        teamMember: true,
      },
      orderBy: [
        { year: 'desc' },
        { weekNumber: 'desc' },
      ],
      take: limit,
    });

    return assignments.map((assignment: StandupAssignment) => ({
      id: assignment.id,
      weekNumber: assignment.weekNumber,
      year: assignment.year,
      mondayDate: assignment.mondayDate,
      teamMemberId: assignment.teamMemberId,
      teamMemberName: assignment.teamMemberName,
      isOverride: assignment.isOverride,
      notes: assignment.notes,
    }));
  } catch (error) {
    console.error('Error fetching member history:', error);
    return [];
  }
}
