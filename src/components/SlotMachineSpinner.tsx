'use client';

import { useState, useEffect, useMemo } from 'react';

interface SlotMachineSpinnerProps {
  teamMembers: string[];
  currentLeader: string;
  onSpin: () => void;
  isSpinning: boolean;
  selectedLeader: string;
}

export default function SlotMachineSpinner({
  teamMembers,
  currentLeader,
  onSpin,
  isSpinning,
  selectedLeader
}: SlotMachineSpinnerProps) {
  const [displayNames, setDisplayNames] = useState<string[]>([]);
  const [spinCount, setSpinCount] = useState(0);

  // Get available members (excluding current leader) - memoized to prevent infinite re-renders
  const availableMembers = useMemo(() => 
    teamMembers.filter(member => member !== currentLeader), 
    [teamMembers, currentLeader]
  );

  useEffect(() => {
    if (isSpinning) {
      setSpinCount(prev => prev + 1);
      const interval = setInterval(() => {
        // Show random name during spinning
        const randomName = availableMembers[Math.floor(Math.random() * availableMembers.length)];
        setDisplayNames([randomName]);
      }, 100);

      return () => clearInterval(interval);
    } else if (selectedLeader) {
      // Show the selected leader
      setDisplayNames([selectedLeader]);
    } else {
      // Show placeholder
      setDisplayNames(['???']);
    }
  }, [isSpinning, selectedLeader, availableMembers]);

  return (
    <div className="space-y-6">
      {/* Slot Machine Display */}
      <div className="relative">
        <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg p-6 border-4 border-gray-300 shadow-inner">
          <div className="flex justify-center">
            <div
              className={`w-48 h-20 bg-white rounded-lg border-2 border-gray-400 flex items-center justify-center text-xl font-bold text-gray-800 shadow-lg ${
                isSpinning ? 'animate-spin-slot' : ''
              }`}
              style={{
                transform: isSpinning ? `translateY(${Math.sin(Date.now() * 0.01) * 2}px)` : 'none'
              }}
            >
              {displayNames[0]}
            </div>
          </div>
          
          {/* Slot Machine Decorative Elements */}
          <div className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 left-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Spin Button */}
      <div className="flex justify-center">
        <button
          onClick={onSpin}
          disabled={isSpinning}
          className={`px-8 py-4 rounded-lg font-bold text-white text-lg transition-all duration-200 transform cursor-pointer ${
            isSpinning
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105 active:scale-95 shadow-lg'
          }`}
        >
          {isSpinning ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>SPINNING...</span>
            </div>
          ) : (
            'SPIN FOR REPLACEMENT'
          )}
        </button>
      </div>
    </div>
  );
}
