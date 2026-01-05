import { getWorkDays } from './holidays';
import { getDateComponentsInEST, getDayOfWeekInEST } from './dateUtils';

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
  // Get the current week number based on Monday-to-Sunday weeks in EST
  const { year, month, day, dayOfWeek } = getDateComponentsInEST();
  
  // Find the Monday of the current week in EST
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday = 0, Monday = 1
  const mondayOfThisWeek = new Date(year, month, day + daysToMonday);
  mondayOfThisWeek.setHours(0, 0, 0, 0);
  
  // Check if there are any work days this week (Monday to Friday)
  const fridayOfThisWeek = new Date(mondayOfThisWeek);
  fridayOfThisWeek.setDate(mondayOfThisWeek.getDate() + 4);
  fridayOfThisWeek.setHours(23, 59, 59, 999);
  const workDays = getWorkDays(mondayOfThisWeek, fridayOfThisWeek);
  
  // If no work days, return empty string (holiday week)
  if (workDays.length === 0) {
    return '';
  }
  
  // Find the first Monday of the year in EST
  const startOfYear = new Date(year, 0, 1);
  startOfYear.setHours(0, 0, 0, 0);
  const startDay = getDayOfWeekInEST(startOfYear);
  const daysToFirstMonday = startDay === 0 ? 1 : 8 - startDay; // If Jan 1 is Sunday, first Monday is Jan 2
  const firstMondayOfYear = new Date(year, 0, 1 + daysToFirstMonday);
  firstMondayOfYear.setHours(0, 0, 0, 0);
  
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
  // Get the next week number based on Monday-to-Sunday weeks in EST
  const { year, month, day, dayOfWeek } = getDateComponentsInEST();
  
  // Find the Monday of current week in EST
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday = 0, Monday = 1
  const mondayOfThisWeek = new Date(year, month, day + daysToMonday);
  mondayOfThisWeek.setHours(0, 0, 0, 0);
  
  // Get Monday of next week
  const mondayOfNextWeek = new Date(mondayOfThisWeek);
  mondayOfNextWeek.setDate(mondayOfThisWeek.getDate() + 7);
  
  // Check if there are any work days next week (Monday to Friday)
  const fridayOfNextWeek = new Date(mondayOfNextWeek);
  fridayOfNextWeek.setDate(mondayOfNextWeek.getDate() + 4);
  fridayOfNextWeek.setHours(23, 59, 59, 999);
  const workDays = getWorkDays(mondayOfNextWeek, fridayOfNextWeek);
  
  // If no work days, return empty string (holiday week)
  if (workDays.length === 0) {
    return '';
  }
  
  // Find the first Monday of the year in EST
  const startOfYear = new Date(year, 0, 1);
  startOfYear.setHours(0, 0, 0, 0);
  const startDay = getDayOfWeekInEST(startOfYear);
  const daysToFirstMonday = startDay === 0 ? 1 : 8 - startDay; // If Jan 1 is Sunday, first Monday is Jan 2
  const firstMondayOfYear = new Date(year, 0, 1 + daysToFirstMonday);
  firstMondayOfYear.setHours(0, 0, 0, 0);
  
  // Calculate weeks since first Monday of year for next week
  const daysSinceFirstMonday = Math.floor((mondayOfNextWeek.getTime() - firstMondayOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const nextWeek = Math.floor(daysSinceFirstMonday / 7);

  // Calculate next week leader based on week number
  const nextLeaderIndex = (nextWeek - 34) % TEAM_MEMBERS.length;
  return TEAM_MEMBERS[nextLeaderIndex];
}

export function getCurrentWeekNumber(): number {
  // Get the current week number based on Monday-to-Sunday weeks in EST
  const { year, month, day, dayOfWeek } = getDateComponentsInEST();
  
  // Find the Monday of the current week in EST
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday = 0, Monday = 1
  const mondayOfThisWeek = new Date(year, month, day + daysToMonday);
  mondayOfThisWeek.setHours(0, 0, 0, 0);
  
  // Find the first Monday of the year in EST
  const startOfYear = new Date(year, 0, 1);
  startOfYear.setHours(0, 0, 0, 0);
  const startDay = getDayOfWeekInEST(startOfYear);
  const daysToFirstMonday = startDay === 0 ? 1 : 8 - startDay; // If Jan 1 is Sunday, first Monday is Jan 2
  const firstMondayOfYear = new Date(year, 0, 1 + daysToFirstMonday);
  firstMondayOfYear.setHours(0, 0, 0, 0);
  
  // Calculate weeks since first Monday of year
  const daysSinceFirstMonday = Math.floor((mondayOfThisWeek.getTime() - firstMondayOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const currentWeek = Math.floor(daysSinceFirstMonday / 7);
  
  return currentWeek + 1; // Return 1-based week number
}

export function getThisWeekDates(): string {
  // Calculate current week dates (Monday to Friday) in EST
  const { year, month, day, dayOfWeek } = getDateComponentsInEST();
  
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday = 0, Monday = 1
  const monday = new Date(year, month, day + daysToMonday);
  monday.setHours(0, 0, 0, 0);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  friday.setHours(23, 59, 59, 999);

  const currentWorkDays = getWorkDays(monday, friday);
  if (currentWorkDays.length > 0) {
    const firstDay = currentWorkDays[0];
    const lastDay = currentWorkDays[currentWorkDays.length - 1];
    return `${firstDay.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/New_York' })} - ${lastDay.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/New_York' })}`;
  } else {
    return 'Holiday Week';
  }
}

export function getNextWeekDates(): string {
  // Calculate next week dates (Monday to Friday) in EST
  const { year, month, day, dayOfWeek } = getDateComponentsInEST();
  
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday = 0, Monday = 1
  const monday = new Date(year, month, day + daysToMonday);
  monday.setHours(0, 0, 0, 0);
  
  // Calculate next week dates
  const nextMonday = new Date(monday);
  nextMonday.setDate(monday.getDate() + 7);
  const nextFriday = new Date(nextMonday);
  nextFriday.setDate(nextMonday.getDate() + 4);
  nextFriday.setHours(23, 59, 59, 999);

  const nextWorkDays = getWorkDays(nextMonday, nextFriday);
  if (nextWorkDays.length > 0) {
    const firstDay = nextWorkDays[0];
    const lastDay = nextWorkDays[nextWorkDays.length - 1];
    return `${firstDay.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/New_York' })} - ${lastDay.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/New_York' })}`;
  } else {
    return 'Holiday Week';
  }
}
