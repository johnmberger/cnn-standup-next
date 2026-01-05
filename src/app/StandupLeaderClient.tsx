'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TEAM_MEMBERS, getCurrentStandupLeader, getNextStandupLeader, getCurrentWeekNumber } from '@/lib/standup';
import { getCurrentWeekDates, getNextWeekDates } from '@/lib/dateUtils';
import { ParallaxCard, CNNHeader, NewsTicker, LeaderCard } from '@/components';

export default function StandupLeaderClient() {
  const [currentLeader, setCurrentLeader] = useState<string>('');
  const [nextLeader, setNextLeader] = useState<string>('');
  const [currentWeekDates, setCurrentWeekDates] = useState<string>('');
  const [nextWeekDates, setNextWeekDates] = useState<string>('');
  const [weekNumber, setWeekNumber] = useState<number>(1);
  
  useEffect(() => {
    setCurrentLeader(getCurrentStandupLeader());
    setNextLeader(getNextStandupLeader());
    setCurrentWeekDates(getCurrentWeekDates());
    setNextWeekDates(getNextWeekDates());
    setWeekNumber(getCurrentWeekNumber());
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <ParallaxCard style={{ borderLeftColor: '#ee0000' }}>
        <CNNHeader />
        <NewsTicker />
        
        <div className="p-8">
          <div className="space-y-8">
            <LeaderCard
              leaderName={currentLeader}
              weekDates={currentWeekDates}
              description="Leading this week's standup"
              statusType="live"
              statusText="LIVE"
              borderColor="#ee0000"
            />
            
            <LeaderCard
              leaderName={nextLeader}
              weekDates={nextWeekDates}
              description="Preparing for next week's rotation"
              statusType="up-next"
              statusText="UP NEXT"
              borderColor="black"
            />
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div>
                Standup rotation • {TEAM_MEMBERS.length} members
              </div>
              <div>
                Week {weekNumber} of 52
              </div>
            </div>
          </div>
        </div>
      </ParallaxCard>
      
      {/* Floating Random Button */}
      <Link 
        href="/random" 
        className="fixed bottom-6 right-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 z-50 w-12 h-12 sm:w-auto sm:h-auto"
        title="Random Leader Spinner"
      >
        <div className="flex items-center justify-center w-full h-full">
          <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-sm font-bold hidden sm:inline ml-2">RANDOM</span>
        </div>
      </Link>
    </main>
  );
}
