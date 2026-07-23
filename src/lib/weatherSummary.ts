import type { LocationWeather, WeatherExtreme } from '@/lib/weather';
import { getWeatherSeverity } from '@/lib/weatherCodes';

const NOTABLE_WEATHER_THRESHOLD = 30;
const IDEAL_TEMPERATURE_F = 72;

function getTemperatureComfortScore(temperatureF: number): number {
  const distance = Math.abs(temperatureF - IDEAL_TEMPERATURE_F);
  return Math.max(0, 100 - distance * 2.5);
}

function getAirQualityScore(airQualityIndex: number | null): number {
  if (airQualityIndex === null) {
    return 75;
  }

  if (airQualityIndex <= 50) {
    return 100;
  }

  if (airQualityIndex <= 100) {
    return 70;
  }

  if (airQualityIndex <= 150) {
    return 40;
  }

  return Math.max(0, 100 - airQualityIndex / 3);
}

function getSubjectiveWeatherScore(location: LocationWeather): number {
  const weatherScore = Math.max(0, 100 - getWeatherSeverity(location.weatherCode));
  const comfortScore = getTemperatureComfortScore(location.temperature);
  const airScore = getAirQualityScore(location.airQualityIndex);

  return weatherScore * 0.4 + comfortScore * 0.5 + airScore * 0.1;
}

function getBestWeatherCity(locations: LocationWeather[]): string | null {
  if (locations.length === 0) {
    return null;
  }

  return [...locations].sort(
    (a, b) => getSubjectiveWeatherScore(b) - getSubjectiveWeatherScore(a)
  )[0].city;
}

export function buildWeatherSummary(locations: LocationWeather[]): {
  wildest: WeatherExtreme | null;
  bestWeatherCity: string | null;
} {
  const wildestCandidate = [...locations].sort(
    (a, b) => getWeatherSeverity(b.weatherCode) - getWeatherSeverity(a.weatherCode)
  )[0];

  const wildest =
    wildestCandidate && getWeatherSeverity(wildestCandidate.weatherCode) >= NOTABLE_WEATHER_THRESHOLD
      ? {
          city: wildestCandidate.city,
          temperature: wildestCandidate.temperature,
          label: wildestCandidate.label,
          emoji: wildestCandidate.emoji,
        }
      : null;

  return {
    wildest,
    bestWeatherCity: getBestWeatherCity(locations),
  };
}
