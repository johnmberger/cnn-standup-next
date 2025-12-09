// US Holidays for 2025 and 2026
export const holidays2025 = [
  new Date(2025, 0, 1),   // New Year's Day - Wednesday, Jan 1
  new Date(2025, 0, 20),  // Martin Luther King Jr. Day - Monday, Jan 20
  new Date(2025, 1, 17),  // Presidents' Day - Monday, Feb 17
  new Date(2025, 4, 26),  // Memorial Day - Monday, May 26
  new Date(2025, 5, 19),  // Juneteenth - Thursday, Jun 19
  new Date(2025, 6, 4),   // Independence Day - Friday, Jul 4
  new Date(2025, 8, 1),   // Labor Day - Monday, Sept 1
  new Date(2025, 10, 27), // Thanksgiving Day - Thursday, Nov 27
  new Date(2025, 10, 28), // Day After Thanksgiving - Friday, Nov 28
  new Date(2025, 11, 25), // Christmas Day - Thursday, Dec 25
  new Date(2025, 11, 26), // Year-End Break - Friday, Dec 26
  new Date(2025, 11, 29), // Year-End Break - Monday, Dec 29
  new Date(2025, 11, 30), // Year-End Break - Tuesday, Dec 30
  new Date(2025, 11, 31), // Year-End Break - Wednesday, Dec 31
];

export const holidays2026 = [
  new Date(2026, 0, 1),   // New Year's Day - Thursday, Jan 1
  new Date(2026, 0, 2),   // Day After New Year's - Friday, Jan 2
  new Date(2026, 0, 19),  // Martin Luther King Jr. Day - Monday, Jan 19
  new Date(2026, 1, 16),  // Presidents' Day - Monday, Feb 16
  new Date(2026, 4, 25),  // Memorial Day - Monday, May 25
  new Date(2026, 5, 19),  // Juneteenth - Friday, June 19
  new Date(2026, 6, 3),   // Independence Day - Friday, July 3
  new Date(2026, 8, 7),   // Labor Day - Monday, Sept 7
  new Date(2026, 10, 26), // Thanksgiving Day - Thursday, Nov 26
  new Date(2026, 10, 27), // Day After Thanksgiving - Friday, Nov 27
  new Date(2026, 11, 25), // Christmas Day - Friday, Dec 25
  new Date(2026, 11, 28), // Year-End Break - Monday, Dec 28
  new Date(2026, 11, 29), // Year-End Break - Tuesday, Dec 29
  new Date(2026, 11, 30), // Year-End Break - Wednesday, Dec 30
  new Date(2026, 11, 31), // Year-End Break - Thursday, Dec 31
];

// Combined holidays for all years
export const allHolidays = [...holidays2025, ...holidays2026];

// Function to check if a date is a holiday
export const isHoliday = (date: Date): boolean => {
  return allHolidays.some(holiday => 
    holiday.getDate() === date.getDate() && 
    holiday.getMonth() === date.getMonth() &&
    holiday.getFullYear() === date.getFullYear()
  );
};

// Function to get work days between two dates (excluding holidays)
export const getWorkDays = (startDate: Date, endDate: Date): Date[] => {
  const workDays: Date[] = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    if (!isHoliday(current)) {
      workDays.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  
  return workDays;
};
