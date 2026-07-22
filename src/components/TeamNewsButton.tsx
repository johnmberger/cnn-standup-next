'use client';

import Link from 'next/link';

function NewsIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.25}
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
      />
    </svg>
  );
}

export default function TeamNewsButton() {
  return (
    <Link
      href="/team-news"
      className="fixed bottom-6 left-6 z-50 flex items-center justify-center cursor-pointer bg-white text-[#ee0000] p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 w-12 h-12 ring-2 ring-white/80"
      title="Team news"
      aria-label="Open team news"
    >
      <NewsIcon className="w-6 h-6 drop-shadow-sm" />
    </Link>
  );
}
