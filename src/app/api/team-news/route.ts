import { NextResponse } from 'next/server';
import { getNextUsTeamHoliday } from '@/lib/holidays';
import { fetchUpcomingInternationalHolidays } from '@/lib/nationalHolidays';
import { fetchTeamLocationWeather } from '@/lib/openMeteo';
import { buildWeatherSummary } from '@/lib/weatherSummary';
import type { TeamNewsData } from '@/lib/weather';

export async function GET() {
  try {
    const locations = await fetchTeamLocationWeather();
    const internationalHolidays = await fetchUpcomingInternationalHolidays();
    const usHoliday = getNextUsTeamHoliday();
    const holidays = [
      ...(usHoliday ? [usHoliday] : []),
      ...internationalHolidays.sort((a, b) => a.daysUntil - b.daysUntil),
    ];
    const summary = buildWeatherSummary(locations);

    return NextResponse.json(
      { locations, summary, holidays } satisfies TeamNewsData,
      {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error) {
    console.error('Failed to fetch team news:', error);
    return NextResponse.json({ error: 'Failed to fetch team news' }, { status: 500 });
  }
}
