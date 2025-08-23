'use client';

import dynamic from 'next/dynamic';
import { IncineratorDataProvider } from '@/contexts/IncineratorDataContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Dynamický import komponenty mapy
const ModernMapClient = dynamic(() => import('./ModernMapClient'), {
    loading: () => <div className="flex items-center justify-center h-screen text-gray-600">Načítání mapy...</div>,
    ssr: false
});

// Komponenta pro navigační položku s hydration safe logickou
function NavItem({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
    return (
        <Link
            href={href}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${isActive
                ? 'bg-blue-500 text-white shadow-md transform scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
                }`}
        >
            {label}
        </Link>
    );
}

// Komponenta pro mobilní navigační položku
function MobileNavItem({ href, label, isActive, onClick }: { href: string; label: string; isActive: boolean; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${isActive
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
        >
            {label}
        </Link>
    );
}

export default function MapModernPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    const navItems = [
        { href: '/', label: 'Hlavní mapa' },
        { href: '/incinerators', label: 'Seznam spaloven' },
        { href: '/about', label: 'O projektu' },
        { href: '/contact', label: 'Kontakt' },
    ];    // Prevent hydration mismatch by not showing active states until mounted
    const getIsActive = (href: string) => mounted && pathname === href;

    return (
        <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
            {/* Profesionální navigační hlavička - pevná pozice */}
            <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 h-20 flex-shrink-0 z-50 fixed top-0 left-0 right-0">
                <div className="max-w-7xl mx-auto h-full px-8 flex items-center">
                    {/* Logo vlevo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-4 hover:opacity-90 transition-all duration-200 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                <span className="text-xl">🗺️</span>
                            </div>
                            <div className="hidden sm:block">
                                <div className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">České spalovny</div>
                                <div className="text-sm text-gray-500">Interaktivní mapa</div>
                            </div>
                        </Link>
                    </div>

                    {/* Centrální oddělení a navigace */}
                    <div className="flex-1 flex justify-center">
                        <div className="w-px bg-gray-200 mx-8 hidden lg:block"></div>

                        {/* Navigační menu ve středu */}
                        <nav className="hidden md:flex items-center bg-gray-50/80 rounded-full px-2 py-2 shadow-inner border border-gray-200/50">
                            {navItems.map((item, index) => (
                                <div key={item.href} className="flex items-center">
                                    <NavItem
                                        href={item.href}
                                        label={item.label}
                                        isActive={getIsActive(item.href)}
                                    />
                                    {index < navItems.length - 1 && (
                                        <div className="w-px h-4 bg-gray-300 mx-1"></div>
                                    )}
                                </div>
                            ))}
                        </nav>

                        <div className="w-px bg-gray-200 mx-8 hidden lg:block"></div>
                    </div>

                    {/* Mobilní hamburger menu vpravo */}
                    <div className="md:hidden ml-auto">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                            aria-label="Otevřít navigační menu"
                        >
                            <svg
                                className={`w-6 h-6 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobilní menu rozbalené */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-xl z-40">
                        <div className="max-w-7xl mx-auto px-8 py-6 space-y-2">
                            {navItems.map((item) => (
                                <MobileNavItem
                                    key={item.href}
                                    href={item.href}
                                    label={item.label}
                                    isActive={getIsActive(item.href)}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </header>

            {/* Mapa přes zbytek obrazovky - posun o výšku hlavičky */}
            <div className="pt-20 h-screen">
                <IncineratorDataProvider>
                    <ModernMapClient />
                </IncineratorDataProvider>
            </div>
        </div>
    );
}