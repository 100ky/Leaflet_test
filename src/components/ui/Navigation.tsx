/**
 * Hlavní navigační komponenta aplikace
 * 
 * Zobrazuje horní menu s odkazy na jednotlivé stránky.
 * Obsahuje logo aplikace České spalovny a responsivní hamburger menu.
 * Automaticky označuje aktivní stránku podle aktuální URL.
 * 
 * @component
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
    const pathname = usePathname();

    // Navigační položky v menu
    const navItems = [
        { href: '/', label: 'Mapa' },
        { href: '/incinerators', label: 'Spalovny' },
        { href: '/about', label: 'O projektu' },
        { href: '/contact', label: 'Kontakt' },
    ];

    return (
        <header className="bg-gradient-to-r from-gray-900 to-slate-800 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Brand vlevo */}
                    <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-xl">🗺️</span>
                        </div>
                        <div>
                            <div className="font-bold text-lg">České spalovny</div>
                            <div className="text-xs text-gray-300">Spalovny České republiky</div>
                        </div>
                    </Link>

                    {/* Navigační menu vpravo */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${pathname === item.href
                                    ? 'bg-green-500 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobilní hamburger menu */}
                    <div className="md:hidden">
                        <button
                            type="button"
                            className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
                            aria-label="Otevřít menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobilní menu rozbalené (zatím skryté, později přidáme state) */}
                <div className="md:hidden hidden border-t border-gray-700">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${pathname === item.href
                                    ? 'bg-green-500 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navigation;