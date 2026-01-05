import { getWorkDays } from '@/lib/holidays';

// Map weekday strings to day numbers (0 = Sunday, 1 = Monday, etc.)
const weekdayMap: { [key: string]: number } = {
  'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6
};

// Get current date components in EST/EDT timezone
export function getDateComponentsInEST(): { year: number; month: number; day: number; dayOfWeek: number } {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  });
  
  const parts = formatter.formatToParts(now);
  const year = parseInt(parts.find(p => p.type === 'year')!.value);
  const month = parseInt(parts.find(p => p.type === 'month')!.value) - 1; // 0-indexed
  const day = parseInt(parts.find(p => p.type === 'day')!.value);
  
  // Get day of week (0 = Sunday, 1 = Monday, etc.)
  const weekdayStr = parts.find(p => p.type === 'weekday')!.value;
  const dayOfWeek = weekdayMap[weekdayStr];
  
  return { year, month, day, dayOfWeek };
}

// Get day of week for a specific date in EST
export function getDayOfWeekInEST(date: Date): number {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
  });
  const weekdayStr = formatter.formatToParts(date).find(p => p.type === 'weekday')!.value;
  return weekdayMap[weekdayStr];
}

export function calculateWeekDates(isCurrentWeek: boolean = true): string {
  const { year, month, day, dayOfWeek } = getDateComponentsInEST();
  
  // Calculate Monday of current week in EST
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday = 0, Monday = 1
  const monday = new Date(year, month, day + daysToMonday);
  monday.setHours(0, 0, 0, 0);
  
  let targetMonday: Date;
  if (isCurrentWeek) {
    targetMonday = monday;
  } else {
    // Next week
    targetMonday = new Date(monday);
    targetMonday.setDate(monday.getDate() + 7);
  }
  
  const friday = new Date(targetMonday);
  friday.setDate(targetMonday.getDate() + 4);
  friday.setHours(23, 59, 59, 999);

  const workDays = getWorkDays(targetMonday, friday);
  if (workDays.length > 0) {
    const firstDay = workDays[0];
    const lastDay = workDays[workDays.length - 1];
    return `${firstDay.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/New_York' })} - ${lastDay.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/New_York' })}`;
  } else {
    return 'Holiday Week';
  }
}

export function getCurrentWeekDates(): string {
  return calculateWeekDates(true);
}

export function getNextWeekDates(): string {
  return calculateWeekDates(false);
}
