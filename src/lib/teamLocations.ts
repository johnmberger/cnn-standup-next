export type TeamLocation = {
  city: string;
  latitude: number;
  longitude: number;
  countryCode: 'US' | 'CA' | 'EC';
  countryName: string;
};

export const TEAM_LOCATIONS: TeamLocation[] = [
  { city: 'Los Angeles, CA', latitude: 34.0522, longitude: -118.2437, countryCode: 'US', countryName: 'United States' },
  { city: 'Seattle, WA', latitude: 47.6062, longitude: -122.3321, countryCode: 'US', countryName: 'United States' },
  { city: 'Detroit, MI', latitude: 42.3314, longitude: -83.0458, countryCode: 'US', countryName: 'United States' },
  { city: 'Atlanta, GA', latitude: 33.749, longitude: -84.388, countryCode: 'US', countryName: 'United States' },
  { city: 'Upstate New York', latitude: 42.6526, longitude: -73.7562, countryCode: 'US', countryName: 'United States' },
  { city: 'Vancouver, BC', latitude: 49.2827, longitude: -123.1207, countryCode: 'CA', countryName: 'Canada' },
  { city: 'Quito, Ecuador', latitude: -0.1807, longitude: -78.4678, countryCode: 'EC', countryName: 'Ecuador' },
];
