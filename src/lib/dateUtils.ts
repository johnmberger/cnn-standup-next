import { getWorkDays } from '@/lib/holidays';

export function calculateWeekDates(isCurrentWeek: boolean = true): string {
  const now = new Date();
  const currentDay = now.getDay();
  const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay; // Sunday = 0, Monday = 1
  const monday = new Date(now);
  monday.setDate(now.getDate() + daysToMonday);
  
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

  const workDays = getWorkDays(targetMonday, friday);
  if (workDays.length > 0) {
    const firstDay = workDays[0];
    const lastDay = workDays[workDays.length - 1];
    return `${firstDay.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} - ${lastDay.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`;
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
