const WEATHER_DESCRIPTIONS: Record<number, { label: string; emoji: string }> = {
  0: { label: 'Clear', emoji: '☀️' },
  1: { label: 'Mostly clear', emoji: '🌤️' },
  2: { label: 'Partly cloudy', emoji: '⛅' },
  3: { label: 'Overcast', emoji: '☁️' },
  45: { label: 'Foggy', emoji: '🌫️' },
  48: { label: 'Icy fog', emoji: '🌫️' },
  51: { label: 'Light drizzle', emoji: '🌦️' },
  53: { label: 'Drizzle', emoji: '🌦️' },
  55: { label: 'Heavy drizzle', emoji: '🌧️' },
  56: { label: 'Freezing drizzle', emoji: '🌧️' },
  57: { label: 'Heavy freezing drizzle', emoji: '🌧️' },
  61: { label: 'Light rain', emoji: '🌧️' },
  63: { label: 'Rain', emoji: '🌧️' },
  65: { label: 'Heavy rain', emoji: '🌧️' },
  66: { label: 'Freezing rain', emoji: '🌨️' },
  67: { label: 'Heavy freezing rain', emoji: '🌨️' },
  71: { label: 'Light snow', emoji: '🌨️' },
  73: { label: 'Snow', emoji: '❄️' },
  75: { label: 'Heavy snow', emoji: '❄️' },
  77: { label: 'Snow grains', emoji: '❄️' },
  80: { label: 'Light showers', emoji: '🌦️' },
  81: { label: 'Showers', emoji: '🌧️' },
  82: { label: 'Heavy showers', emoji: '🌧️' },
  85: { label: 'Snow showers', emoji: '🌨️' },
  86: { label: 'Heavy snow showers', emoji: '❄️' },
  95: { label: 'Thunderstorm', emoji: '⛈️' },
  96: { label: 'Thunderstorm with hail', emoji: '⛈️' },
  99: { label: 'Heavy thunderstorm with hail', emoji: '⛈️' },
};

export function getWeatherDescription(code: number): { label: string; emoji: string } {
  return WEATHER_DESCRIPTIONS[code] ?? { label: 'Unknown', emoji: '🌡️' };
}

const WEATHER_SEVERITY: Record<number, number> = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  45: 10,
  48: 12,
  51: 20,
  53: 25,
  55: 30,
  56: 35,
  57: 40,
  61: 30,
  63: 40,
  65: 50,
  66: 55,
  67: 60,
  71: 45,
  73: 55,
  75: 65,
  77: 50,
  80: 35,
  81: 45,
  82: 55,
  85: 50,
  86: 60,
  95: 80,
  96: 90,
  99: 100,
};

export function getWeatherSeverity(code: number): number {
  return WEATHER_SEVERITY[code] ?? 0;
}
