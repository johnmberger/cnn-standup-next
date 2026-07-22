import { NextResponse } from 'next/server';
import { getNextUsTeamHoliday } from '@/lib/holidays';
import { fetchUpcomingInternationalHolidays } from '@/lib/nationalHolidays';
import { TEAM_LOCATIONS } from '@/lib/teamLocations';
import { getWeatherDescription } from '@/lib/weatherCodes';
import { buildWeatherSummary } from '@/lib/weatherSummary';
import type { TeamNewsData } from '@/lib/weather';

type OpenMeteoCurrent = {
  temperature_2m: number;
  weather_code: number;
};

type OpenMeteoResponse = {
  current: OpenMeteoCurrent;
};

async function fetchWeatherForLocation(
  latitude: number,
  longitude: number
): Promise<OpenMeteoCurrent> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(latitude));
  url.searchParams.set('longitude', String(longitude));
  url.searchParams.set('current', 'temperature_2m,weather_code');
  url.searchParams.set('temperature_unit', 'fahrenheit');

  const response = await fetch(url.toString(), { next: { revalidate: 1800 } });

  if (!response.ok) {
    throw new Error(`Weather API returned ${response.status}`);
  }

  const data = (await response.json()) as OpenMeteoResponse;
  return data.current;
}

export async function GET() {
  try {
    const locations = await Promise.all(
      TEAM_LOCATIONS.map(async (location) => {
        const current = await fetchWeatherForLocation(location.latitude, location.longitude);
        const { label, emoji } = getWeatherDescription(current.weather_code);

        return {
          city: location.city,
          countryCode: location.countryCode,
          temperature: Math.round(current.temperature_2m),
          weatherCode: current.weather_code,
          label,
          emoji,
        };
      })
    );
    const internationalHolidays = await fetchUpcomingInternationalHolidays();
    const usHoliday = getNextUsTeamHoliday();
    const holidays = [
      ...(usHoliday ? [usHoliday] : []),
      ...internationalHolidays,
    ].sort((a, b) => a.daysUntil - b.daysUntil);

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
