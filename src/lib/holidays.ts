import type { UpcomingHoliday } from '@/lib/weather';

type TeamHoliday = {
  date: Date;
  name: string;
};

type HolidayPeriod = {
  name: string;
  startDate: Date;
  endDate: Date;
};

// Helper function to create normalized holiday dates (at midnight)
const createHolidayDate = (year: number, month: number, day: number): Date => {
  const date = new Date(year, month, day);
  date.setHours(0, 0, 0, 0);
  return date;
};

// US team holidays for 2025 and 2026
const usTeamHolidays2025: TeamHoliday[] = [
  { date: createHolidayDate(2025, 0, 1), name: "New Year's Day" },
  { date: createHolidayDate(2025, 0, 20), name: 'Martin Luther King Jr. Day' },
  { date: createHolidayDate(2025, 1, 17), name: "Presidents' Day" },
  { date: createHolidayDate(2025, 4, 26), name: 'Memorial Day' },
  { date: createHolidayDate(2025, 5, 19), name: 'Juneteenth' },
  { date: createHolidayDate(2025, 6, 4), name: 'Independence Day' },
  { date: createHolidayDate(2025, 8, 1), name: 'Labor Day' },
  { date: createHolidayDate(2025, 10, 27), name: 'Thanksgiving Day' },
  { date: createHolidayDate(2025, 10, 28), name: 'Day After Thanksgiving' },
  { date: createHolidayDate(2025, 11, 25), name: 'Christmas Day' },
  { date: createHolidayDate(2025, 11, 26), name: 'Year-End Break' },
  { date: createHolidayDate(2025, 11, 29), name: 'Year-End Break' },
  { date: createHolidayDate(2025, 11, 30), name: 'Year-End Break' },
  { date: createHolidayDate(2025, 11, 31), name: 'Year-End Break' },
];

const usTeamHolidays2026: TeamHoliday[] = [
  { date: createHolidayDate(2026, 0, 1), name: "New Year's Day" },
  { date: createHolidayDate(2026, 0, 2), name: "Day After New Year's" },
  { date: createHolidayDate(2026, 0, 19), name: 'Martin Luther King Jr. Day' },
  { date: createHolidayDate(2026, 1, 16), name: "Presidents' Day" },
  { date: createHolidayDate(2026, 4, 25), name: 'Memorial Day' },
  { date: createHolidayDate(2026, 5, 19), name: 'Juneteenth' },
  { date: createHolidayDate(2026, 6, 3), name: 'Independence Day' },
  { date: createHolidayDate(2026, 8, 7), name: 'Labor Day' },
  { date: createHolidayDate(2026, 10, 26), name: 'Thanksgiving Day' },
  { date: createHolidayDate(2026, 10, 27), name: 'Day After Thanksgiving' },
  { date: createHolidayDate(2026, 11, 25), name: 'Christmas Day' },
  { date: createHolidayDate(2026, 11, 28), name: 'Year-End Break' },
  { date: createHolidayDate(2026, 11, 29), name: 'Year-End Break' },
  { date: createHolidayDate(2026, 11, 30), name: 'Year-End Break' },
  { date: createHolidayDate(2026, 11, 31), name: 'Year-End Break' },
];

const usTeamHolidays = [...usTeamHolidays2025, ...usTeamHolidays2026];
const allHolidays = usTeamHolidays.map((holiday) => holiday.date);

function isHoliday(date: Date): boolean {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  return allHolidays.some((holiday) => {
    return (
      holiday.getFullYear() === year &&
      holiday.getMonth() === month &&
      holiday.getDate() === day
    );
  });
}

export function getWorkDays(startDate: Date, endDate: Date): Date[] {
  const workDays: Date[] = [];

  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    return workDays;
  }

  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  if (end < current) {
    return workDays;
  }

  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && !isHoliday(current)) {
      workDays.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }

  return workDays;
}

function formatHolidayDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function normalizeDate(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function getDaysUntil(date: Date, fromDate = new Date()): number {
  const from = normalizeDate(fromDate);
  const holidayDate = normalizeDate(date);

  return Math.round((holidayDate.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

function mapHolidayPeriods(periods: HolidayPeriod[], fromDate: Date): UpcomingHoliday[] {
  const from = normalizeDate(fromDate);

  return periods
    .filter((period) => period.endDate >= from)
    .map((period) => ({
      countryCode: 'US',
      countryName: 'United States',
      name: period.name,
      dateLabel: formatHolidayDateRange(period.startDate, period.endDate),
      daysUntil: getDaysUntil(period.startDate, from),
    }));
}

function isNextCalendarDay(previous: Date, next: Date): boolean {
  const dayAfterPrevious = new Date(previous);
  dayAfterPrevious.setDate(dayAfterPrevious.getDate() + 1);
  dayAfterPrevious.setHours(0, 0, 0, 0);

  const nextDay = new Date(next);
  nextDay.setHours(0, 0, 0, 0);

  return dayAfterPrevious.getTime() === nextDay.getTime();
}

function continuesBreak(period: HolidayPeriod, holiday: TeamHoliday): boolean {
  if (!isNextCalendarDay(period.endDate, holiday.date)) {
    return false;
  }

  if (holiday.name === period.name) {
    return true;
  }

  if (period.name === 'Thanksgiving Day' && holiday.name === 'Day After Thanksgiving') {
    return true;
  }

  if (period.name === "New Year's Day" && holiday.name === "Day After New Year's") {
    return true;
  }

  return false;
}

function mergeBreakName(currentName: string, nextName: string): string {
  if (currentName === 'Thanksgiving Day' && nextName === 'Day After Thanksgiving') {
    return 'Thanksgiving Break';
  }

  if (currentName === "New Year's Day" && nextName === "Day After New Year's") {
    return "New Year's Break";
  }

  return currentName;
}

function groupConsecutiveHolidays(holidays: TeamHoliday[]): HolidayPeriod[] {
  const sorted = [...holidays].sort((a, b) => a.date.getTime() - b.date.getTime());
  const periods: HolidayPeriod[] = [];

  for (const holiday of sorted) {
    const current = periods[periods.length - 1];

    if (current && continuesBreak(current, holiday)) {
      current.endDate = holiday.date;
      current.name = mergeBreakName(current.name, holiday.name);
      continue;
    }

    periods.push({
      name: holiday.name,
      startDate: holiday.date,
      endDate: holiday.date,
    });
  }

  return periods;
}

function formatMonthDay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function formatHolidayDateRange(startDate: Date, endDate: Date): string {
  if (startDate.getTime() === endDate.getTime()) {
    return formatHolidayDate(startDate);
  }

  const sameMonth =
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear();

  if (sameMonth) {
    const month = startDate.toLocaleDateString('en-US', { month: 'short' });
    return `${month} ${startDate.getDate()}–${endDate.getDate()}`;
  }

  const sameYear = startDate.getFullYear() === endDate.getFullYear();

  if (sameYear) {
    return `${formatMonthDay(startDate)} – ${formatMonthDay(endDate)}`;
  }

  return `${formatMonthDay(startDate)}, ${startDate.getFullYear()} – ${formatMonthDay(endDate)}, ${endDate.getFullYear()}`;
}

export function getNextUsTeamHoliday(fromDate = new Date()): UpcomingHoliday | null {
  const [nextHoliday] = mapHolidayPeriods(groupConsecutiveHolidays(usTeamHolidays), fromDate);
  return nextHoliday ?? null;
}
