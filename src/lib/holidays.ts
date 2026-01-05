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

// Function to check if a date is a holiday
export const isHoliday = (date: Date): boolean => {
  // Normalize the input date to midnight for comparison
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  
  return allHolidays.some(holiday => {
    const normalizedHoliday = new Date(holiday);
    normalizedHoliday.setHours(0, 0, 0, 0);
    return normalizedDate.getTime() === normalizedHoliday.getTime();
  });
};

// Function to get work days between two dates (excluding holidays and weekends)
export const getWorkDays = (startDate: Date, endDate: Date): Date[] => {
  const workDays: Date[] = [];
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  
  // Iterate through each day
  while (current <= end) {
    const dayOfWeek = current.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    // Only include weekdays (Monday = 1, Friday = 5)
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && !isHoliday(current)) {
      workDays.push(new Date(current));
    }
    // Move to next day
    current.setDate(current.getDate() + 1);
  }
  
  return workDays;
};
