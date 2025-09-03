'use client';

import { useState, useEffect } from 'react';
import { TEAM_MEMBERS, getCurrentStandupLeader, getNextStandupLeader, getCurrentWeekNumber } from '@/lib/standup';
import { getCurrentWeekDates, getNextWeekDates } from '@/lib/dateUtils';
import { ParallaxCard, CNNHeader, NewsTicker, LeaderCard } from '@/components';

export default function StandupLeaderClient() {
  const [currentLeader, setCurrentLeader] = useState<string>('');
  const [nextLeader, setNextLeader] = useState<string>('');
  const [currentWeekDates, setCurrentWeekDates] = useState<string>('');
  const [nextWeekDates, setNextWeekDates] = useState<string>('');
  useEffect(() => {
    setCurrentLeader(getCurrentStandupLeader());
    setNextLeader(getNextStandupLeader());
    setCurrentWeekDates(getCurrentWeekDates());
    setNextWeekDates(getNextWeekDates());
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
                Week {getCurrentWeekNumber()} of 52
              </div>
            </div>
          </div>
        </div>
      </ParallaxCard>
    </main>
  );
}
