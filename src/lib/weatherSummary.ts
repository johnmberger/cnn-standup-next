import type { LocationWeather, WeatherExtreme } from '@/lib/weather';
import { getWeatherSeverity } from '@/lib/weatherCodes';

const NOTABLE_WEATHER_THRESHOLD = 30;

export function buildWeatherSummary(locations: LocationWeather[]): { wildest: WeatherExtreme | null } {
  const wildest = [...locations].sort(
    (a, b) => getWeatherSeverity(b.weatherCode) - getWeatherSeverity(a.weatherCode)
  )[0];

  if (getWeatherSeverity(wildest.weatherCode) < NOTABLE_WEATHER_THRESHOLD) {
    return { wildest: null };
  }

  return {
    wildest: {
      city: wildest.city,
      temperature: wildest.temperature,
      label: wildest.label,
      emoji: wildest.emoji,
    },
  };
}
