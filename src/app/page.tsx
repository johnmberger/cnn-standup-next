import { Metadata } from 'next';
import { getCurrentStandupLeader, getNextStandupLeader, getCurrentWeekNumber } from '@/lib/standup';
import StandupLeaderClient from './StandupLeaderClient';

export async function generateMetadata(): Promise<Metadata> {
  const currentLeader = getCurrentStandupLeader();
  const nextLeader = getNextStandupLeader();
  const weekNumber = getCurrentWeekNumber();
  const currentYear = new Date().getFullYear();

  return {
    title: `CNN Media Management - ${currentLeader} is leading this week`,
    description: `Breaking News: ${currentLeader} is leading standup this week (Week ${weekNumber} of ${currentYear}). Next week: ${nextLeader}. CNN Team Standup Rotation.`,
    openGraph: {
      title: `CNN Media Management - ${currentLeader} is leading this week`,
      description: `Breaking News: ${currentLeader} is leading standup this week (Week ${weekNumber} of ${currentYear}). Next week: ${nextLeader}.`,
      type: 'website',
      siteName: 'CNN Media Management',
      images: [
        {
          url: '/api/og-image',
          width: 1200,
          height: 630,
          alt: `${currentLeader} is leading standup this week`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `CNN Media Management - ${currentLeader} is leading this week`,
      description: `Breaking News: ${currentLeader} is leading standup this week (Week ${weekNumber} of ${currentYear}). Next week: ${nextLeader}.`,
      images: ['/api/og-image'],
    },
    other: {
      'slack:title': `CNN Media Management - ${currentLeader} is leading this week`,
      'slack:description': `Breaking News: ${currentLeader} is leading standup this week (Week ${weekNumber} of ${currentYear}). Next week: ${nextLeader}.`,
      'slack:image': '/api/og-image',
    },
  };
}

export default function Home() {
  return <StandupLeaderClient />;
}