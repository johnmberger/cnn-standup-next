import { Metadata } from 'next';
import SpinnerClient from './SpinnerClient';

export const metadata: Metadata = {
  title: 'Standup Leader Spinner - CNN Media Management',
  description: 'Randomize a new standup leader when the current leader is out',
  openGraph: {
    title: 'Standup Leader Spinner',
    description: 'Randomize a new standup leader when the current leader is out',
    type: 'website',
    siteName: 'CNN Media Management',
  },
};

export default function SpinnerPage() {
  return <SpinnerClient />;
}
