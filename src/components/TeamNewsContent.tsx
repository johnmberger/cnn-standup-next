import type { LocationWeather, UpcomingHoliday, WeatherSummary } from '@/lib/weather';
import { getAirQualityAlert } from '@/lib/airQuality';
import { getCountryFlag } from '@/lib/countryFlags';
import { TEAM_LOCATIONS } from '@/lib/teamLocations';
import {
  convertTemperature,
  formatTemperatureUnit,
  type TemperatureUnit,
} from '@/lib/temperature';

const GRID_BORDER = 'border-l border-t border-gray-200';
const GRID_CELL_BORDER = 'bg-white border-r border-b border-gray-200';
const HOLIDAY_GRID = `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 ${GRID_BORDER}`;
const WEATHER_GRID = `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 ${GRID_BORDER}`;
const GRID_CELL = `px-5 py-5 ${GRID_CELL_BORDER}`;
const WEATHER_CELL = `px-4 py-4 ${GRID_CELL_BORDER}`;
const WEATHER_SKELETON_CELL = `h-36 bg-gray-100 animate-pulse border-r border-b border-gray-200`;

function formatDaysUntil(daysUntil: number): string {
  if (daysUntil === 0) {
    return 'today';
  }

  if (daysUntil === 1) {
    return 'tomorrow';
  }

  return `in ${daysUntil} days`;
}

function SectionBadge({
  children,
  variant = 'live',
}: {
  children: React.ReactNode;
  variant?: 'live' | 'dark';
}) {
  return (
    <div
      className="inline-flex items-center text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider"
      style={{
        background:
          variant === 'live'
            ? 'linear-gradient(135deg, #ee0000 0%, #cc0000 100%)'
            : 'black',
      }}
    >
      <span>{children}</span>
    </div>
  );
}

function TemperatureUnitToggle({
  unit,
  onChange,
}: {
  unit: TemperatureUnit;
  onChange: (unit: TemperatureUnit) => void;
}) {
  return (
    <div className="inline-flex rounded-md border border-gray-200 overflow-hidden text-xs font-bold">
      {(['F', 'C'] as const).map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={`cursor-pointer px-3 py-1 transition-colors ${
            unit === value ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'
          }`}
          aria-pressed={unit === value}
        >
          °{value}
        </button>
      ))}
    </div>
  );
}

export function FieldConditionsGrid({
  locations,
  summary,
  unit,
  onUnitChange,
}: {
  locations: LocationWeather[];
  summary: Pick<WeatherSummary, 'bestWeatherCity'>;
  unit: TemperatureUnit;
  onUnitChange: (unit: TemperatureUnit) => void;
}) {
  return (
    <section>
      <div className="flex items-center justify-between gap-4 mb-5">
        <SectionBadge>Field Conditions</SectionBadge>
        <TemperatureUnitToggle unit={unit} onChange={onUnitChange} />
      </div>
      <div className={WEATHER_GRID}>
        {locations.map((location) => {
          const airQualityAlert =
            location.airQualityIndex !== null
              ? getAirQualityAlert(location.airQualityIndex)
              : null;

          return (
          <div key={location.city} className={WEATHER_CELL}>
            <p className="text-sm font-bold text-black leading-snug">
              <span className="mr-1.5" aria-hidden="true">
                {getCountryFlag(location.countryCode)}
              </span>
              {location.city}
            </p>
            <p className="text-4xl font-black text-black leading-none mt-3">
              {convertTemperature(location.temperature, unit)}
              <span className="text-2xl align-top">{formatTemperatureUnit(unit)}</span>
            </p>
            <p className="text-xs font-medium text-gray-600 mt-2">
              {location.emoji} {location.label}
            </p>
            {airQualityAlert && (
              <p className="text-xs font-medium text-gray-600 mt-1">
                {airQualityAlert.icon} {airQualityAlert.label}
              </p>
            )}
            {summary.bestWeatherCity === location.city && (
              <span className="inline-flex items-center mt-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-900">
                ★ Best weather today
              </span>
            )}
          </div>
          );
        })}
      </div>
    </section>
  );
}

export function TeamNewsBriefing({
  summary,
  holidays,
}: {
  summary: WeatherSummary;
  holidays: UpcomingHoliday[];
}) {
  return (
    <div className="space-y-8">
      {summary.wildest && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <SectionBadge variant="dark">Weather Desk</SectionBadge>
          </div>
          <div
            className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-4 border-l-4"
            style={{ borderLeftColor: 'black' }}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Wildest Conditions
            </p>
            <p className="text-base font-semibold text-black mt-2">
              {summary.wildest.city} — {summary.wildest.emoji} {summary.wildest.label}
            </p>
          </div>
        </section>
      )}

      {holidays.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <SectionBadge variant="dark">Holiday Watch</SectionBadge>
          </div>
          <div className={HOLIDAY_GRID}>
            {holidays.map((holiday) => (
              <div key={`${holiday.countryCode}-${holiday.name}-${holiday.dateLabel}`} className={GRID_CELL}>
                <p className="text-sm font-bold text-black">
                  <span className="mr-2 text-lg leading-none" aria-hidden="true">
                    {getCountryFlag(holiday.countryCode)}
                  </span>
                  {holiday.countryName}
                </p>
                <p className="text-3xl font-black text-black leading-none mt-4">{holiday.dateLabel}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mt-2">
                  {formatDaysUntil(holiday.daysUntil)}
                </p>
                <p className="text-sm font-medium text-gray-600 mt-3">{holiday.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function TeamNewsSkeleton() {
  return (
    <div className="space-y-8">
      <div className={WEATHER_GRID}>
        {Array.from({ length: TEAM_LOCATIONS.length }).map((_, index) => (
          <div key={index} className={WEATHER_SKELETON_CELL} />
        ))}
      </div>
      <div className="h-24 rounded-lg bg-gray-100 animate-pulse" />
    </div>
  );
}
