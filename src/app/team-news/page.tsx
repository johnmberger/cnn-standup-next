import { Metadata } from 'next';
import TeamNewsClient from './TeamNewsClient';

export const metadata: Metadata = {
  title: 'Team News',
  description: 'Live weather and holiday updates across team locations',
  openGraph: {
    title: 'Team News',
    description: 'Live weather and holiday updates across team locations',
    type: 'website',
  },
};

export default function TeamNewsPage() {
  return <TeamNewsClient />;
}
