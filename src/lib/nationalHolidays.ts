import type { UpcomingHoliday } from '@/lib/weather';
import { TEAM_LOCATIONS } from '@/lib/teamLocations';

type NagerHoliday = {
  date: string;
  localName: string;
  name: string;
};

type InternationalCountry = {
  countryCode: Exclude<(typeof TEAM_LOCATIONS)[number]['countryCode'], 'US'>;
  countryName: string;
};

function getInternationalTeamCountries(): InternationalCountry[] {
  const countries = new Map<string, string>();

  for (const location of TEAM_LOCATIONS) {
    if (location.countryCode !== 'US') {
      countries.set(location.countryCode, location.countryName);
    }
  }

  return [...countries.entries()].map(([countryCode, countryName]) => ({
    countryCode: countryCode as InternationalCountry['countryCode'],
    countryName,
  }));
}

function formatHolidayDate(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function getDaysUntil(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dateString.split('-').map(Number);
  const holidayDate = new Date(year, month - 1, day);
  holidayDate.setHours(0, 0, 0, 0);

  return Math.round((holidayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

async function fetchNextHoliday(country: InternationalCountry): Promise<UpcomingHoliday | null> {
  const response = await fetch(
    `https://date.nager.at/api/v3/NextPublicHolidays/${country.countryCode}`,
    { next: { revalidate: 86400 } }
  );

  if (!response.ok) {
    return null;
  }

  const holidays = (await response.json()) as NagerHoliday[];
  const nextHoliday = holidays[0];

  if (!nextHoliday) {
    return null;
  }

  return {
    countryCode: country.countryCode,
    countryName: country.countryName,
    name: nextHoliday.localName || nextHoliday.name,
    dateLabel: formatHolidayDate(nextHoliday.date),
    daysUntil: getDaysUntil(nextHoliday.date),
  };
}

export async function fetchUpcomingInternationalHolidays(): Promise<UpcomingHoliday[]> {
  const holidays = await Promise.all(getInternationalTeamCountries().map(fetchNextHoliday));

  return holidays.filter((holiday): holiday is UpcomingHoliday => holiday !== null);
}
