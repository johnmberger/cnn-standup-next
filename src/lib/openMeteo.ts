import { getWeatherDescription } from '@/lib/weatherCodes';
import { TEAM_LOCATIONS } from '@/lib/teamLocations';
import type { LocationWeather } from '@/lib/weather';

const WEATHER_CACHE = { next: { revalidate: 1800 } } as const;

type OpenMeteoCurrent = {
  temperature_2m: number;
  weather_code: number;
};

type OpenMeteoResponse = {
  current: OpenMeteoCurrent;
};

type OpenMeteoAirQualityResponse = {
  current?: {
    us_aqi?: number;
  };
};

async function fetchCurrentWeather(
  latitude: number,
  longitude: number
): Promise<OpenMeteoCurrent> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(latitude));
  url.searchParams.set('longitude', String(longitude));
  url.searchParams.set('current', 'temperature_2m,weather_code');
  url.searchParams.set('temperature_unit', 'fahrenheit');

  const response = await fetch(url.toString(), WEATHER_CACHE);

  if (!response.ok) {
    throw new Error(`Weather API returned ${response.status}`);
  }

  const data = (await response.json()) as OpenMeteoResponse;
  return data.current;
}

async function fetchCurrentAirQuality(
  latitude: number,
  longitude: number
): Promise<number | null> {
  const url = new URL('https://air-quality-api.open-meteo.com/v1/air-quality');
  url.searchParams.set('latitude', String(latitude));
  url.searchParams.set('longitude', String(longitude));
  url.searchParams.set('current', 'us_aqi');

  const response = await fetch(url.toString(), WEATHER_CACHE);

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as OpenMeteoAirQualityResponse;
  const airQualityIndex = data.current?.us_aqi;

  return typeof airQualityIndex === 'number' ? Math.round(airQualityIndex) : null;
}

export async function fetchTeamLocationWeather(): Promise<LocationWeather[]> {
  return Promise.all(
    TEAM_LOCATIONS.map(async (location) => {
      const [current, airQualityIndex] = await Promise.all([
        fetchCurrentWeather(location.latitude, location.longitude),
        fetchCurrentAirQuality(location.latitude, location.longitude),
      ]);
      const { label, emoji } = getWeatherDescription(current.weather_code);

      return {
        city: location.city,
        countryCode: location.countryCode,
        temperature: Math.round(current.temperature_2m),
        weatherCode: current.weather_code,
        label,
        emoji,
        airQualityIndex,
      };
    })
  );
}
