'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="bg-white max-w-2xl w-full border-l-4 shadow-2xl" style={{ borderLeftColor: '#ee0000' }}>
                {/* CNN Header */}
                <div className="text-white px-6 py-4" style={{ backgroundColor: '#ee0000' }}>
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
                    </div>
                </div>

                {/* Breaking News Ticker */}
                <div className="overflow-hidden" style={{ backgroundColor: '#ee0000' }}>
                    <div className="ticker text-white text-sm font-bold py-2 whitespace-nowrap">
                        <span className="inline-block mr-8">
                            BREAKING NEWS • PAGE NOT FOUND • BREAKING NEWS • PAGE NOT FOUND • BREAKING NEWS • PAGE NOT FOUND • BREAKING NEWS • PAGE NOT FOUND
                        </span>
                        <span className="inline-block mr-8">
                            BREAKING NEWS • PAGE NOT FOUND • BREAKING NEWS • PAGE NOT FOUND • BREAKING NEWS • PAGE NOT FOUND • BREAKING NEWS • PAGE NOT FOUND
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="space-y-6">
                        {/* 404 Error */}
                        <div className="border-b-2 border-gray-200 pb-6">
                            <div className="flex items-center justify-start space-x-3 mb-4">
                                <div className="text-white text-sm font-bold px-3 py-1 rounded-md flex items-center space-x-2" style={{ background: 'linear-gradient(135deg, #ee0000 0%, #cc0000 100%)' }}>
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                    <span>ERROR</span>
                                </div>
                                <h1 className="text-6xl font-bold text-black">
                                    404
                                </h1>
                            </div>
                            <div className="px-6 border-l-8" style={{ borderLeftColor: '#ee0000' }}>
                                <p className="text-3xl font-bold text-black leading-tight mb-2">
                                    This page has been cancelled.
                                </p>
                                <p className="text-lg text-gray-600">
                                    Our sources tell us this page went missing during a live broadcast
                                </p>
                            </div>
                        </div>

                        {/* CNN Puns */}
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-bold text-black mb-2">📺 What Our Anchors Are Saying:</h3>
                                <p className="text-gray-700 italic">
                                    "This is clearly a case of digital journalism gone wrong.
                                    The page was last seen heading towards the exit during our 6 PM broadcast."
                                </p>
                                <p className="text-sm text-gray-500 mt-2">- Anderson Cooper, probably</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-6">
                            <button
                                onClick={() => window.history.back()}
                                className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Go Back in Time
                            </button>
                            <Link
                                href="/"
                                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 ml-4"
                            >
                                Return to Techwood
                            </Link>

                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <div>
                                Error 404 • Page Not Found
                            </div>
                            <div>
                                CNN Media Management Team • {new Date().getFullYear()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
