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
  
  // Create Monday date - use setDate to handle month boundaries correctly
  const mondayOfThisWeek = new Date(now);
  mondayOfThisWeek.setDate(now.getDate() + daysToMonday);
  mondayOfThisWeek.setHours(0, 0, 0, 0);
  
  // Check if there are any work days this week (Monday to Friday)
  const fridayOfThisWeek = new Date(mondayOfThisWeek);
  fridayOfThisWeek.setDate(mondayOfThisWeek.getDate() + 4);
  fridayOfThisWeek.setHours(0, 0, 0, 0);
  const workDays = getWorkDays(mondayOfThisWeek, fridayOfThisWeek);
  
  // If no work days, return empty string (holiday week)
  if (workDays.length === 0) {
    return '';
  }
  
  // Find the first Monday of the year
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  startOfYear.setHours(0, 0, 0, 0);
  const startDay = startOfYear.getDay();
  const daysToFirstMonday = startDay === 0 ? 1 : 8 - startDay; // If Jan 1 is Sunday, first Monday is Jan 2
  const firstMondayOfYear = new Date(now.getFullYear(), 0, 1 + daysToFirstMonday, 0, 0, 0, 0);
  
  // Calculate weeks since first Monday of year
  const daysSinceFirstMonday = Math.floor((mondayOfThisWeek.getTime() - firstMondayOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const currentWeek = Math.floor(daysSinceFirstMonday / 7);

  // Calculate current week leader based on week number
  // Adjusted so Allen (index 0) is the current leader for a specific week
  // We need to offset by a specific week number to make Allen current
  // Use ((n % m) + m) % m to handle negative numbers correctly
  const currentLeaderIndex = ((currentWeek - 34) % TEAM_MEMBERS.length + TEAM_MEMBERS.length) % TEAM_MEMBERS.length;
  return TEAM_MEMBERS[currentLeaderIndex];
}

export function getNextStandupLeader(): string {
  // Get the next week number based on Monday-to-Sunday weeks
  const now = new Date();
  
  // Find the Monday of current week
  const currentDay = now.getDay();
  const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay; // Sunday = 0, Monday = 1
  
  // Create Monday date - use setDate to handle month boundaries correctly
  const mondayOfThisWeek = new Date(now);
  mondayOfThisWeek.setDate(now.getDate() + daysToMonday);
  mondayOfThisWeek.setHours(0, 0, 0, 0);
  
  // Get Monday of next week (7 days after current Monday)
  const mondayOfNextWeek = new Date(mondayOfThisWeek);
  mondayOfNextWeek.setDate(mondayOfThisWeek.getDate() + 7);
  
  // Check if there are any work days next week (Monday to Friday)
  const fridayOfNextWeek = new Date(mondayOfNextWeek);
  fridayOfNextWeek.setDate(mondayOfNextWeek.getDate() + 4);
  fridayOfNextWeek.setHours(0, 0, 0, 0);
  const workDays = getWorkDays(mondayOfNextWeek, fridayOfNextWeek);
  
  // If no work days, return empty string (holiday week)
  if (workDays.length === 0) {
    return '';
  }
  
  // Find the first Monday of the year
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  startOfYear.setHours(0, 0, 0, 0);
  const startDay = startOfYear.getDay();
  const daysToFirstMonday = startDay === 0 ? 1 : 8 - startDay; // If Jan 1 is Sunday, first Monday is Jan 2
  const firstMondayOfYear = new Date(now.getFullYear(), 0, 1 + daysToFirstMonday, 0, 0, 0, 0);
  
  // Calculate weeks since first Monday of year for next week
  const daysSinceFirstMonday = Math.floor((mondayOfNextWeek.getTime() - firstMondayOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const nextWeek = Math.floor(daysSinceFirstMonday / 7);

  // Calculate next week leader based on week number
  // Use ((n % m) + m) % m to handle negative numbers correctly
  const nextLeaderIndex = ((nextWeek - 34) % TEAM_MEMBERS.length + TEAM_MEMBERS.length) % TEAM_MEMBERS.length;
  return TEAM_MEMBERS[nextLeaderIndex];
}

export function getCurrentWeekNumber(): number {
  const now = new Date();
  
  // Find the Monday of the current week
  const currentDay = now.getDay();
  const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay; // Sunday = 0, Monday = 1
  const mondayOfThisWeek = new Date(now);
  mondayOfThisWeek.setDate(now.getDate() + daysToMonday);
  mondayOfThisWeek.setHours(0, 0, 0, 0);
  
  // Find the first Monday of the year
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  startOfYear.setHours(0, 0, 0, 0);
  const startDay = startOfYear.getDay();
  const daysToFirstMonday = startDay === 0 ? 1 : 8 - startDay; // If Jan 1 is Sunday, first Monday is Jan 2
  const firstMondayOfYear = new Date(startOfYear);
  firstMondayOfYear.setDate(startOfYear.getDate() + daysToFirstMonday);
  firstMondayOfYear.setHours(0, 0, 0, 0);
  
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
  
  // Create Monday date - use setDate to handle month boundaries correctly
  const monday = new Date(now);
  monday.setDate(now.getDate() + daysToMonday);
  monday.setHours(0, 0, 0, 0);
  
  // Create Friday date (4 days after Monday)
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  friday.setHours(0, 0, 0, 0);

  const workDays = getWorkDays(monday, friday);
  if (workDays.length > 0) {
    const firstDay = workDays[0];
    const lastDay = workDays[workDays.length - 1];
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
  
  // Create Monday date - use setDate to handle month boundaries correctly
  const monday = new Date(now);
  monday.setDate(now.getDate() + daysToMonday);
  monday.setHours(0, 0, 0, 0);
  
  // Calculate next week dates (7 days after current Monday)
  const nextMonday = new Date(monday);
  nextMonday.setDate(monday.getDate() + 7);
  
  // Friday is 4 days after next Monday
  const nextFriday = new Date(nextMonday);
  nextFriday.setDate(nextMonday.getDate() + 4);
  nextFriday.setHours(0, 0, 0, 0);

  const workDays = getWorkDays(nextMonday, nextFriday);
  if (workDays.length > 0) {
    const firstDay = workDays[0];
    const lastDay = workDays[workDays.length - 1];
    return `${firstDay.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} - ${lastDay.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`;
  } else {
    return 'Holiday Week';
  }
}
