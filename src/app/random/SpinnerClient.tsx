'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TEAM_MEMBERS, getCurrentStandupLeader } from '@/lib/standup';
import { getCurrentWeekDates } from '@/lib/dateUtils';
import { CNNHeader, NewsTicker, LeaderCard, SlotMachineSpinner } from '@/components';

export default function SpinnerClient() {
  const [currentLeader, setCurrentLeader] = useState<string>('');
  const [currentWeekDates, setCurrentWeekDates] = useState<string>('');
  const [selectedLeader, setSelectedLeader] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  useEffect(() => {
    setCurrentLeader(getCurrentStandupLeader());
    setCurrentWeekDates(getCurrentWeekDates());
  }, []);

  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedLeader('');
    
    // Get available team members (excluding current leader)
    const availableMembers = TEAM_MEMBERS.filter(member => member !== currentLeader);
    
    // Randomly select a new leader
    const randomIndex = Math.floor(Math.random() * availableMembers.length);
    const newLeader = availableMembers[randomIndex];
    
    // Simulate spinning delay
    setTimeout(() => {
      setSelectedLeader(newLeader);
      setIsSpinning(false);
    }, 3000); // 3 second spin
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full border-l-4 shadow-2xl animate-slide-in-up" style={{ borderLeftColor: '#ee0000' }}>
        <CNNHeader />
        <NewsTicker />
        
        <div className="p-8">
          <div className="space-y-8">
            {/* Current Leader Card */}
            <LeaderCard
              leaderName={currentLeader}
              weekDates={currentWeekDates}
              description="Current week&apos;s leader (out today)"
              statusType="live"
              statusText="OUT TODAY"
              borderColor="#ee0000"
            />
            
            {/* Slot Machine Spinner */}
            <div className="border-b-2 border-gray-200 pb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-white text-sm font-bold px-3 py-1 rounded-md flex items-center space-x-2"
                     style={{ 
                       background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)' 
                     }}>
                  <span>SPIN TO WIN</span>
                </div>
                <h2 className="text-lg font-bold text-black uppercase tracking-wide">
                  Random Replacement
                </h2>
              </div>
              
              <div className="px-6 border-l-8" style={{ borderLeftColor: '#ff6b35' }}>
                <SlotMachineSpinner
                  teamMembers={TEAM_MEMBERS}
                  currentLeader={currentLeader}
                  onSpin={handleSpin}
                  isSpinning={isSpinning}
                  selectedLeader={selectedLeader}
                />
              </div>
            </div>

            {/* Selected Leader Result */}
            {selectedLeader && !isSpinning && (
              <LeaderCard
                leaderName={selectedLeader}
                weekDates="Today Only"
                description="Selected to lead today&apos;s standup"
                statusType="up-next"
                statusText="WINNER"
                title="Today&apos;s Replacement Leader"
                borderColor="black"
              />
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div>
                Emergency replacement • {TEAM_MEMBERS.length - 1} available members
              </div>
              <div>
                Excluding this week&apos;s leader
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Home Button */}
      <Link 
        href="/" 
        className="fixed bottom-6 right-6 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 z-50 w-12 h-12 sm:w-auto sm:h-auto"
        title="Back to Main Page"
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
