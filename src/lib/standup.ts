import { getWorkDays } from './holidays';

// Dummy list of 10 people
export const TEAM_MEMBERS = [
  "Allen",
  "Brad",
  "Cristian",
  "Rich",
  "Elise",
  "Heddy",
  "John",
  "Graham",
  "Michael",
  "David",
  "Liz",
  "Marc",
];

export function getCurrentStandupLeader(): string {
  // Get the current week number based on Monday-to-Sunday weeks
  const now = new Date();
  
  // Find the Monday of the current week
  const currentDay = now.getDay();
  const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay; // Sunday = 0, Monday = 1
  const mondayOfThisWeek = new Date(now);
  mondayOfThisWeek.setDate(now.getDate() + daysToMonday);
  
  // Find the first Monday of the year
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const startDay = startOfYear.getDay();
  const daysToFirstMonday = startDay === 0 ? 1 : 8 - startDay; // If Jan 1 is Sunday, first Monday is Jan 2
  const firstMondayOfYear = new Date(startOfYear);
  firstMondayOfYear.setDate(startOfYear.getDate() + daysToFirstMonday);
  
  // Calculate weeks since first Monday of year
  const daysSinceFirstMonday = Math.floor((mondayOfThisWeek.getTime() - firstMondayOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const currentWeek = Math.floor(daysSinceFirstMonday / 7);

  // Calculate current week leader based on week number
  // Adjusted so Allen (index 0) is the current leader for a specific week
  // We need to offset by a specific week number to make Allen current
  const currentLeaderIndex = (currentWeek - 34) % TEAM_MEMBERS.length;
  return TEAM_MEMBERS[currentLeaderIndex];
}

export function getNextStandupLeader(): string {
  // Get the next week number based on Monday-to-Sunday weeks
  const now = new Date();
  
  // Find the Monday of next week
  const currentDay = now.getDay();
  const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay; // Sunday = 0, Monday = 1
  const mondayOfThisWeek = new Date(now);
  mondayOfThisWeek.setDate(now.getDate() + daysToMonday);
  
  // Get Monday of next week
  const mondayOfNextWeek = new Date(mondayOfThisWeek);
  mondayOfNextWeek.setDate(mondayOfThisWeek.getDate() + 7);
  
  // Find the first Monday of the year
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const startDay = startOfYear.getDay();
  const daysToFirstMonday = startDay === 0 ? 1 : 8 - startDay; // If Jan 1 is Sunday, first Monday is Jan 2
  const firstMondayOfYear = new Date(startOfYear);
  firstMondayOfYear.setDate(startOfYear.getDate() + daysToFirstMonday);
  
  // Calculate weeks since first Monday of year for next week
  const daysSinceFirstMonday = Math.floor((mondayOfNextWeek.getTime() - firstMondayOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const nextWeek = Math.floor(daysSinceFirstMonday / 7);

  // Calculate next week leader based on week number
  const nextLeaderIndex = (nextWeek - 34) % TEAM_MEMBERS.length;
  return TEAM_MEMBERS[nextLeaderIndex];
}

export function getCurrentWeekNumber(): number {
  const now = new Date();
  
  // Find the Monday of the current week
  const currentDay = now.getDay();
  const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay; // Sunday = 0, Monday = 1
  const mondayOfThisWeek = new Date(now);
  mondayOfThisWeek.setDate(now.getDate() + daysToMonday);
  
  // Find the first Monday of the year
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const startDay = startOfYear.getDay();
  const daysToFirstMonday = startDay === 0 ? 1 : 8 - startDay; // If Jan 1 is Sunday, first Monday is Jan 2
  const firstMondayOfYear = new Date(startOfYear);
  firstMondayOfYear.setDate(startOfYear.getDate() + daysToFirstMonday);
  
  // Calculate weeks since first Monday of year
  const daysSinceFirstMonday = Math.floor((mondayOfThisWeek.getTime() - firstMondayOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const currentWeek = Math.floor(daysSinceFirstMonday / 7);
  
  return currentWeek + 1; // Return 1-based week number
}

export function getThisWeekDates(): string {
  // Calculate current week dates (Monday to Friday)
  const now = new Date();
  const currentDay = now.getDay();
  const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay; // Sunday = 0, Monday = 1
  const monday = new Date(now);
  monday.setDate(now.getDate() + daysToMonday);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const currentWorkDays = getWorkDays(monday, friday);
  if (currentWorkDays.length > 0) {
    const firstDay = currentWorkDays[0];
    const lastDay = currentWorkDays[currentWorkDays.length - 1];
    return `${firstDay.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} - ${lastDay.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`;
  } else {
    return 'Holiday Week';
  }
}

export function getNextWeekDates(): string {
  // Calculate next week dates (Monday to Friday)
  const now = new Date();
  const currentDay = now.getDay();
  const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay; // Sunday = 0, Monday = 1
  const monday = new Date(now);
  monday.setDate(now.getDate() + daysToMonday);
  
  // Calculate next week dates
  const nextMonday = new Date(monday);
  nextMonday.setDate(monday.getDate() + 7);
  const nextFriday = new Date(nextMonday);
  nextFriday.setDate(nextMonday.getDate() + 4);

  const nextWorkDays = getWorkDays(nextMonday, nextFriday);
  if (nextWorkDays.length > 0) {
    const firstDay = nextWorkDays[0];
    const lastDay = nextWorkDays[nextWorkDays.length - 1];
    return `${firstDay.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} - ${lastDay.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`;
  } else {
    return 'Holiday Week';
  }
}
