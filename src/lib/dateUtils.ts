// Re-export functions from standup.ts for backward compatibility
import { getThisWeekDates, getNextWeekDates } from './standup';

export const getCurrentWeekDates = getThisWeekDates;
export { getNextWeekDates };
