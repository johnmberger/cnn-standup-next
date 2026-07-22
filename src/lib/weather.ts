export type LocationWeather = {
  city: string;
  countryCode: string;
  temperature: number;
  weatherCode: number;
  label: string;
  emoji: string;
};

export type WeatherExtreme = {
  city: string;
  temperature: number;
  label: string;
  emoji: string;
};

export type WeatherSummary = {
  wildest: WeatherExtreme | null;
};

export type UpcomingHoliday = {
  countryCode: string;
  countryName: string;
  name: string;
  dateLabel: string;
  daysUntil: number;
};

export type TeamNewsData = {
  locations: LocationWeather[];
  summary: WeatherSummary;
  holidays: UpcomingHoliday[];
};
