'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { TeamNewsData } from '@/lib/weather';
import {
  getStoredTemperatureUnit,
  storeTemperatureUnit,
  type TemperatureUnit,
} from '@/lib/temperature';
import {
  FieldConditionsGrid,
  TeamNewsBriefing,
  TeamNewsSkeleton,
} from '@/components/TeamNewsContent';
import { CNNHeader, NewsTicker } from '@/components';

function formatUpdatedAt(date: Date): string {
  const timeZone = 'America/New_York';
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  });

  const dayKey = (value: Date) =>
    value.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone,
    });

  const todayKey = dayKey(new Date());
  const updatedKey = dayKey(date);

  if (todayKey === updatedKey) {
    return `Updated today at ${time} ET`;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (dayKey(yesterday) === updatedKey) {
    return `Updated yesterday at ${time} ET`;
  }

  const dateLabel = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone,
  });

  return `Updated ${dateLabel} at ${time} ET`;
}

export default function TeamNewsClient() {
  const [data, setData] = useState<TeamNewsData | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('F');

  useEffect(() => {
    const storedUnit = getStoredTemperatureUnit();
    if (storedUnit) {
      setTemperatureUnit(storedUnit);
    }
  }, []);

  function handleTemperatureUnitChange(unit: TemperatureUnit) {
    setTemperatureUnit(unit);
    storeTemperatureUnit(unit);
  }

  useEffect(() => {
    let isMounted = true;

    async function loadTeamNews() {
      try {
        const response = await fetch('/api/team-news');

        if (!response.ok) {
          throw new Error('Unable to load team news');
        }

        const payload = (await response.json()) as TeamNewsData;

        if (isMounted) {
          setData(payload);
          setUpdatedAt(new Date());
          setError(null);
        }
      } catch {
        if (isMounted) {
          setError('Team news unavailable right now');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTeamNews();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div
        className="bg-white max-w-4xl w-full border-l-4 shadow-2xl"
        style={{ borderLeftColor: '#ee0000' }}
      >
        <CNNHeader />
        <NewsTicker text="TEAM NEWS" />

        <div className="p-8">
          {isLoading ? (
            <TeamNewsSkeleton />
          ) : error ? (
            <p className="text-sm text-gray-600">{error}</p>
          ) : data ? (
            <div className="space-y-10">
              <FieldConditionsGrid
                locations={data.locations}
                summary={data.summary}
                unit={temperatureUnit}
                onUnitChange={handleTemperatureUnitChange}
              />
              {(data.summary.wildest || data.holidays.length > 0) && (
                <div className="border-t-2 border-gray-200 pt-10">
                  <TeamNewsBriefing summary={data.summary} holidays={data.holidays} />
                </div>
              )}
            </div>
          ) : null}

          <div className="mt-10 pt-2">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div>Team locations • Live conditions</div>
              <div>{updatedAt ? formatUpdatedAt(updatedAt) : 'Updating...'}</div>
            </div>
          </div>
        </div>
      </div>

      <Link
        href="/"
        className="fixed bottom-6 right-6 cursor-pointer bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 z-50 w-12 h-12 sm:w-auto sm:h-auto"
        title="Back to main page"
      >
        <div className="flex items-center justify-center w-full h-full">
          <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-sm font-bold hidden sm:inline ml-2">HOME</span>
        </div>
      </Link>
    </main>
  );
}
