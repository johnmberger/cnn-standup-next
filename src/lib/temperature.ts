export type TemperatureUnit = 'F' | 'C';

const TEMPERATURE_UNIT_STORAGE_KEY = 'team-news-temperature-unit';

function isTemperatureUnit(value: string | null): value is TemperatureUnit {
  return value === 'F' || value === 'C';
}

export function getStoredTemperatureUnit(): TemperatureUnit | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = localStorage.getItem(TEMPERATURE_UNIT_STORAGE_KEY);
  return isTemperatureUnit(stored) ? stored : null;
}

export function storeTemperatureUnit(unit: TemperatureUnit): void {
  localStorage.setItem(TEMPERATURE_UNIT_STORAGE_KEY, unit);
}

export function convertTemperature(fahrenheit: number, unit: TemperatureUnit): number {
  if (unit === 'F') {
    return fahrenheit;
  }

  return Math.round((fahrenheit - 32) * (5 / 9));
}

export function formatTemperatureUnit(unit: TemperatureUnit): string {
  return unit === 'F' ? '°F' : '°C';
}
