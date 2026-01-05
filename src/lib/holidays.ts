// Helper function to create normalized holiday dates (at midnight)
const createHolidayDate = (year: number, month: number, day: number): Date => {
  const date = new Date(year, month, day);
  date.setHours(0, 0, 0, 0);
  return date;
};

// US Holidays for 2025 and 2026
export const holidays2025 = [
  createHolidayDate(2025, 0, 1),   // New Year's Day - Wednesday, Jan 1
  createHolidayDate(2025, 0, 20),  // Martin Luther King Jr. Day - Monday, Jan 20
  createHolidayDate(2025, 1, 17),  // Presidents' Day - Monday, Feb 17
  createHolidayDate(2025, 4, 26),  // Memorial Day - Monday, May 26
  createHolidayDate(2025, 5, 19),  // Juneteenth - Thursday, Jun 19
  createHolidayDate(2025, 6, 4),   // Independence Day - Friday, Jul 4
  createHolidayDate(2025, 8, 1),   // Labor Day - Monday, Sept 1
  createHolidayDate(2025, 10, 27), // Thanksgiving Day - Thursday, Nov 27
  createHolidayDate(2025, 10, 28), // Day After Thanksgiving - Friday, Nov 28
  createHolidayDate(2025, 11, 25), // Christmas Day - Thursday, Dec 25
  createHolidayDate(2025, 11, 26), // Year-End Break - Friday, Dec 26
  createHolidayDate(2025, 11, 29), // Year-End Break - Monday, Dec 29
  createHolidayDate(2025, 11, 30), // Year-End Break - Tuesday, Dec 30
  createHolidayDate(2025, 11, 31), // Year-End Break - Wednesday, Dec 31
];

export const holidays2026 = [
  createHolidayDate(2026, 0, 1),   // New Year's Day - Thursday, Jan 1
  createHolidayDate(2026, 0, 2),   // Day After New Year's - Friday, Jan 2
  createHolidayDate(2026, 0, 19),  // Martin Luther King Jr. Day - Monday, Jan 19
  createHolidayDate(2026, 1, 16),  // Presidents' Day - Monday, Feb 16
  createHolidayDate(2026, 4, 25),  // Memorial Day - Monday, May 25
  createHolidayDate(2026, 5, 19),  // Juneteenth - Friday, June 19
  createHolidayDate(2026, 6, 3),   // Independence Day - Friday, July 3
  createHolidayDate(2026, 8, 7),   // Labor Day - Monday, Sept 7
  createHolidayDate(2026, 10, 26), // Thanksgiving Day - Thursday, Nov 26
  createHolidayDate(2026, 10, 27), // Day After Thanksgiving - Friday, Nov 27
  createHolidayDate(2026, 11, 25), // Christmas Day - Friday, Dec 25
  createHolidayDate(2026, 11, 28), // Year-End Break - Monday, Dec 28
  createHolidayDate(2026, 11, 29), // Year-End Break - Tuesday, Dec 29
  createHolidayDate(2026, 11, 30), // Year-End Break - Wednesday, Dec 30
  createHolidayDate(2026, 11, 31), // Year-End Break - Thursday, Dec 31
];

// Combined holidays for all years
export const allHolidays = [...holidays2025, ...holidays2026];

// Helper function to get date components in EST
function getDateComponentsInEST(date: Date): { year: number; month: number; day: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const parts = formatter.formatToParts(date);
  return {
    year: parseInt(parts.find(p => p.type === 'year')!.value),
    month: parseInt(parts.find(p => p.type === 'month')!.value) - 1, // 0-indexed
    day: parseInt(parts.find(p => p.type === 'day')!.value),
  };
}

// Function to check if a date is a holiday (checking in EST timezone)
export const isHoliday = (date: Date): boolean => {
  const estComponents = getDateComponentsInEST(date);
  return allHolidays.some(holiday => 
    holiday.getDate() === estComponents.day && 
    holiday.getMonth() === estComponents.month &&
    holiday.getFullYear() === estComponents.year
  );
};

// Helper function to get day of week in EST for a date
function getDayOfWeekInEST(date: Date): number {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
  });
  const weekdayStr = formatter.formatToParts(date).find(p => p.type === 'weekday')!.value;
  const weekdayMap: { [key: string]: number } = {
    'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6
  };
  return weekdayMap[weekdayStr];
}

// Function to get work days between two dates (excluding holidays and weekends)
// All date checks are done in EST timezone
export const getWorkDays = (startDate: Date, endDate: Date): Date[] => {
  const workDays: Date[] = [];
  const current = new Date(startDate);
  // Normalize to midnight to avoid time component issues
  current.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // Include the full end date
  
  while (current <= end) {
    // Check day of week in EST, not local timezone
    const dayOfWeek = getDayOfWeekInEST(current);
    // Only include weekdays (Monday = 1, Friday = 5)
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && !isHoliday(current)) {
      workDays.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  
  return workDays;
};
