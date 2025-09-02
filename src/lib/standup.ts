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
  // Get the current week number (0-based)
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const currentWeek = Math.floor(days / 7);

  // Calculate current week leader based on week number
  // Adjusted so Allen (index 0) is the current leader (week 35, index 34)
  // We need to offset by -34 to make Allen current: (34 - 34) % 12 = 0
  const currentLeaderIndex = (currentWeek - 34) % TEAM_MEMBERS.length;
  return TEAM_MEMBERS[currentLeaderIndex];
}

export function getNextStandupLeader(): string {
  // Get the current week number (0-based)
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const currentWeek = Math.floor(days / 7);

  // Calculate next week leader based on week number
  // Adjusted so Allen (index 0) is the current leader (week 35, index 34)
  // Next week would be: (34 + 1 - 34) % 12 = 1 (Brad)
  const nextLeaderIndex = (currentWeek + 1 - 34) % TEAM_MEMBERS.length;
  return TEAM_MEMBERS[nextLeaderIndex];
}

export function getCurrentWeekNumber(): number {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  return Math.floor(days / 7) + 1;
}

export function getThisWeekDates(): string {
  // Import getWorkDays from holidays
  const { getWorkDays } = require('@/lib/holidays');
  
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
  // Import getWorkDays from holidays
  const { getWorkDays } = require('@/lib/holidays');
  
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
