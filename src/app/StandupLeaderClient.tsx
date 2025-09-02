'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { TEAM_MEMBERS, getCurrentStandupLeader, getNextStandupLeader, getCurrentWeekNumber } from '@/lib/standup';

export default function StandupLeaderClient() {
  const [currentLeader, setCurrentLeader] = useState<string>('');
  const [nextLeader, setNextLeader] = useState<string>('');
  const [currentWeekDates, setCurrentWeekDates] = useState<string>('');
  const [nextWeekDates, setNextWeekDates] = useState<string>('');

  useEffect(() => {
    setCurrentLeader(getCurrentStandupLeader());
    setNextLeader(getNextStandupLeader());
    
    // Calculate current week dates (Monday to Friday)
    const now = new Date();
    const currentDay = now.getDay();
    const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay; // Sunday = 0, Monday = 1
    const monday = new Date(now);
    monday.setDate(now.getDate() + daysToMonday);
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    
    setCurrentWeekDates(`${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${friday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
    
    // Calculate next week dates
    const nextMonday = new Date(monday);
    nextMonday.setDate(monday.getDate() + 7);
    const nextFriday = new Date(nextMonday);
    nextFriday.setDate(nextMonday.getDate() + 4);
    
    setNextWeekDates(`${nextMonday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${nextFriday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
  }, []);

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full border-l-4 border-red-600 shadow-2xl">
        {/* CNN Header */}
        <div className="bg-red-600 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <Image 
                src="/cnn-logo-red-large.jpg" 
                alt="CNN Logo" 
                width={120}
                height={48}
                className="h-12 w-auto"
                priority
              />
              <div className="text-sm font-medium tracking-wide">
                MEDIA MANAGEMENT TEAM
              </div>
            </div>
            <div className="text-xs text-red-100">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8">
          <div className="space-y-8">
            {/* Current Week Leader */}
            <div className="border-b-2 border-gray-200 pb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  LIVE
                </div>
                <h2 className="text-lg font-bold text-black uppercase tracking-wide">
                  This Week's Leader
                </h2>
              </div>
              <div className="px-6 border-l-8 border-red-600">
                <p className="text-5xl font-bold text-black leading-tight">
                  {currentLeader}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {currentWeekDates}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Leading daily standup meetings
                </p>
              </div>
            </div>
            
            {/* Next Week Leader */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-black text-white text-sm font-bold px-3 py-1 rounded-full">
                  UP NEXT
                </div>
                <h2 className="text-lg font-bold text-black uppercase tracking-wide">
                  Next Week's Leader
                </h2>
              </div>
              <div className="px-6 border-l-8 border-black">
                <p className="text-5xl font-bold text-black leading-tight">
                  {nextLeader}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {nextWeekDates}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Preparing for next week's rotation
                </p>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div>
                Team rotation • {TEAM_MEMBERS.length} members
              </div>
              <div>
                Week {getCurrentWeekNumber()} of {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
