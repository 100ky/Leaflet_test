'use client';

import dynamic from 'next/dynamic';
import { IncineratorDataProvider } from '@/contexts/IncineratorDataContext';
import Link from 'next/link';

// Dynamický import komponenty mapy
const ModernMapClient = dynamic(() => import('./ModernMapClient'), {
    loading: () => <div className="flex items-center justify-center h-screen text-gray-600">Načítání mapy...</div>,
    ssr: false
});

export default function MapModernPage() {
    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Minimalistická navigační lišta */}
            <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex-shrink-0 z-50 relative">
                <div className="h-full px-6 flex items-center justify-between">
                    {/* Logo a název vlevo */}
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                                <span className="text-lg">🗺️</span>
                            </div>
                            <div className="font-bold text-lg text-gray-900">České spalovny</div>
                        </Link>
                    </div>

                    {/* Navigační menu vpravo */}
                    <nav className="flex items-center space-x-6">
                        <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                            Domů
                        </Link>
                        <Link href="/incinerators" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                            Seznam
                        </Link>
                        <Link href="/about" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                            O projektu
                        </Link>
                        <Link href="/contact" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                            Kontakt
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Mapa přes zbytek obrazovky */}
            <div className="flex-1 relative">
                <IncineratorDataProvider>
                    <ModernMapClient />
                </IncineratorDataProvider>
            </div>
        </div>
    );
}