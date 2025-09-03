import { Metadata } from 'next';
import { getCurrentStandupLeader, getNextStandupLeader } from '@/lib/standup';
import StandupLeaderClient from './StandupLeaderClient';

export async function generateMetadata(): Promise<Metadata> {
  const currentLeader = getCurrentStandupLeader();
  const nextLeader = getNextStandupLeader();

  return {
    description: `${currentLeader} is leading standup this week. Next week: ${nextLeader}. CNN Team Standup Rotation.`,
    openGraph: {
      title: `CNN Media Management Team`,
      description: `${currentLeader} is leading standup this week. Next week: ${nextLeader}.`,
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
      title: `CNN Media Management`,
      description: `${currentLeader} is leading standup this week. Next week: ${nextLeader}.`,
      images: ['/api/og-image'],
    },
    other: {
      'slack:title': `CNN Media Management - ${currentLeader} is leading standup this week`,
      'slack:description': `Next week: ${nextLeader}.`,
      'slack:image': '/api/og-image',
    },
  };
}

export default function Home() {
  return <StandupLeaderClient />;
}