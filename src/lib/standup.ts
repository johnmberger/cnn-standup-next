import { getWorkDays } from './holidays';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

// Configure dayjs plugins
dayjs.extend(utc);

// Helper function to get current date/time in US Eastern timezone
// This ensures consistent results regardless of where the server/client is located
// Uses manual offset calculation for Edge runtime compatibility
function getNowInEasternTime() {
  const now = dayjs.utc();
  
  // Calculate Eastern time offset (EST: UTC-5, EDT: UTC-4)
  // Simple DST approximation: March through October
  const month = now.month(); // 0-indexed
  const isDST = month >= 2 && month <= 9; // March (2) to October (9)
  const offsetHours = isDST ? -4 : -5;
  
  return now.add(offsetHours, 'hour');
}

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
  "Kenny",
  "David",
  "Liz",
  "Marc",
];

export function getCurrentStandupLeader(): string {
  // Get the current week number based on Monday-to-Sunday weeks
  // Use Eastern time to ensure consistency regardless of server/client location
  const now = getNowInEasternTime();
  
  // Find the Monday of the current week
  const currentDay = now.day(); // dayjs: 0 = Sunday, 1 = Monday, etc.
  const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const mondayOfThisWeek = now.add(daysToMonday, 'day').startOf('day');
  
  // Check if there are any work days this week (Monday to Friday)
  const fridayOfThisWeek = mondayOfThisWeek.add(4, 'day');
  const workDays = getWorkDays(mondayOfThisWeek.toDate(), fridayOfThisWeek.toDate());
  
  // If no work days, return empty string (holiday week)
  if (workDays.length === 0) {
    return '';
  }
  
  // Find the first Monday of the year
  const startOfYear = now.startOf('year');
  const startDay = startOfYear.day();
  const daysToFirstMonday = startDay === 0 ? 1 : 8 - startDay;
  const firstMondayOfYear = startOfYear.add(daysToFirstMonday - 1, 'day').startOf('day');
  
  // Calculate weeks since first Monday of year
  const currentWeek = mondayOfThisWeek.diff(firstMondayOfYear, 'week');

  // Calculate current week leader based on week number
  // Adjusted so Brad (index 1) is the current leader for week 8
  // Use ((n % m) + m) % m to handle negative numbers correctly
  const currentLeaderIndex = ((currentWeek - 33) % TEAM_MEMBERS.length + TEAM_MEMBERS.length) % TEAM_MEMBERS.length;
  return TEAM_MEMBERS[currentLeaderIndex];
}

export function getNextStandupLeader(): string {
  // Get the next week number based on Monday-to-Sunday weeks
  // Use Eastern time to ensure consistency regardless of server/client location
  const now = getNowInEasternTime();
  
  // Find the Monday of current week
  const currentDay = now.day();
  const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const mondayOfThisWeek = now.add(daysToMonday, 'day').startOf('day');
  
  // Get Monday of next week (7 days after current Monday)
  const mondayOfNextWeek = mondayOfThisWeek.add(7, 'day');
  
  // Check if there are any work days next week (Monday to Friday)
  const fridayOfNextWeek = mondayOfNextWeek.add(4, 'day');
  const workDays = getWorkDays(mondayOfNextWeek.toDate(), fridayOfNextWeek.toDate());
  
  // If no work days, return empty string (holiday week)
  if (workDays.length === 0) {
    return '';
  }
  
  // Calculate current week number first (reusing the same logic)
  const startOfYear = now.startOf('year');
  const startDay = startOfYear.day();
  const daysToFirstMonday = startDay === 0 ? 1 : 8 - startDay;
  const firstMondayOfYear = startOfYear.add(daysToFirstMonday - 1, 'day').startOf('day');
  
  // Calculate current week number
  const currentWeek = mondayOfThisWeek.diff(firstMondayOfYear, 'week');
  
  // Next week is simply current week + 1
  const nextWeek = currentWeek + 1;

  // Calculate next week leader based on week number
  // Use ((n % m) + m) % m to handle negative numbers correctly
  const nextLeaderIndex = ((nextWeek - 33) % TEAM_MEMBERS.length + TEAM_MEMBERS.length) % TEAM_MEMBERS.length;
  return TEAM_MEMBERS[nextLeaderIndex];
}

export function getCurrentWeekNumber(): number {
  // Use Eastern time to ensure consistency regardless of server/client location
  const now = getNowInEasternTime();
  
  // Find the Monday of the current week
  const currentDay = now.day();
  const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const mondayOfThisWeek = now.add(daysToMonday, 'day').startOf('day');
  
  // Find the first Monday of the year
  const startOfYear = now.startOf('year');
  const startDay = startOfYear.day();
  const daysToFirstMonday = startDay === 0 ? 1 : 8 - startDay;
  const firstMondayOfYear = startOfYear.add(daysToFirstMonday - 1, 'day').startOf('day');
  
  // Calculate weeks since first Monday of year
  const currentWeek = mondayOfThisWeek.diff(firstMondayOfYear, 'week');
  
  return currentWeek + 1; // Return 1-based week number
}

export function getThisWeekDates(): string {
  // Calculate current week dates (Monday to Friday)
  // Use Eastern time to ensure consistency regardless of server/client location
  const now = getNowInEasternTime();
  const currentDay = now.day();
  const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  
  const monday = now.add(daysToMonday, 'day').startOf('day');
  const friday = monday.add(4, 'day');

  const workDays = getWorkDays(monday.toDate(), friday.toDate());
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
  // Use Eastern time to ensure consistency regardless of server/client location
  const now = getNowInEasternTime();
  const currentDay = now.day();
  const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  
  const monday = now.add(daysToMonday, 'day').startOf('day');
  const nextMonday = monday.add(7, 'day');
  const nextFriday = nextMonday.add(4, 'day');

  const workDays = getWorkDays(nextMonday.toDate(), nextFriday.toDate());
  if (workDays.length > 0) {
    const firstDay = workDays[0];
    const lastDay = workDays[workDays.length - 1];
    return `${firstDay.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} - ${lastDay.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`;
  } else {
    return 'Holiday Week';
  }
}
