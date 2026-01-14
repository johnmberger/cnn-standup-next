import { NextResponse } from 'next/server';
import { 
  getCurrentStandupLeaderFromDB, 
  getNextStandupLeaderFromDB 
} from '@/lib/db';
import { 
  getCurrentStandupLeader, 
  getNextStandupLeader 
} from '@/lib/standup';

// Revalidate every hour
export const revalidate = 3600;

export async function GET() {
  try {
    // Try database first
    const [currentLeader, nextLeader] = await Promise.all([
      getCurrentStandupLeaderFromDB(),
      getNextStandupLeaderFromDB(),
    ]);
    
    // Fallback to JavaScript logic if database returns null
    const current = currentLeader || getCurrentStandupLeader();
    const next = nextLeader || getNextStandupLeader();
    
    return NextResponse.json({
      currentLeader: current,
      nextLeader: next,
      source: currentLeader ? 'database' : 'fallback',
    });
  } catch (error) {
    console.error('Error fetching standup leaders:', error);
    
    // Fallback to js logic on error
    return NextResponse.json({
      currentLeader: getCurrentStandupLeader(),
      nextLeader: getNextStandupLeader(),
      source: 'fallback',
      error: 'Database unavailable, using fallback',
    });
  }
}
