// Re-export date functions from standup.ts for backward compatibility
// These functions use dayjs internally for date calculations in US Eastern timezone
import { getThisWeekDates, getNextWeekDates } from './standup';

export const getCurrentWeekDates = getThisWeekDates;
export { getNextWeekDates };
