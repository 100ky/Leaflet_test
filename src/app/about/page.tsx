'use client';

import Navigation from '@/components/ui/Navigation';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            {/* Hero sekce */}
            <section className="bg-gray-900 text-white py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-6">
                            O projektu <span className="text-green-400">EcoMap CZ</span>
                        </h1>
                        <p className="text-lg text-gray-300">
                            Komplexní přehled spaloven odpadu v České republice s interaktivní mapou a detailními informacemi
                        </p>
                    </div>
                </div>
            </section>

            {/* Hlavní obsah */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Levý sloupec */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Účel projektu</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    EcoMap CZ je interaktivní mapa určená k vizualizaci a analýze spaloven komunálního odpadu
                                    na území České republiky. Poskytuje komplexní přehled o umístění, kapacitách a technologiích
                                    jednotlivých zařízení.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Technologie</h2>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        <span>Next.js 15 s App Router</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                        <span>React Leaflet pro interaktivní mapy</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                        <span>TypeScript pro type safety</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                        <span>Tailwind CSS pro styling</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                        <span>OpenStreetMap jako podkladová mapa</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Pravý sloupec */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Funkce aplikace</h2>
                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                                        <h3 className="font-semibold text-gray-900 mb-2">📍 Interaktivní mapa</h3>
                                        <p className="text-sm text-gray-600">
                                            Zoom, pan, kliknutí na markery pro detailní informace
                                        </p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                                        <h3 className="font-semibold text-gray-900 mb-2">🏗️ Detailní pohledy</h3>
                                        <p className="text-sm text-gray-600">
                                            Zobrazení areálů a budov při vysokém přiblížení
                                        </p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                                        <h3 className="font-semibold text-gray-900 mb-2">🔄 Dual API</h3>
                                        <p className="text-sm text-gray-600">
                                            Přepínání mezi lokálními a vzdálenými zdroji dat
                                        </p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                                        <h3 className="font-semibold text-gray-900 mb-2">📊 Real-time data</h3>
                                        <p className="text-sm text-gray-600">
                                            Aktuální informace o provozu a kapacitách
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sekce s dalšími informacemi */}
                    <div className="mt-16 pt-8 border-t">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🌱</span>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Environmentální dopad</h3>
                                <p className="text-sm text-gray-600">
                                    Sledování vlivu spaloven na životní prostředí a jejich efektivity
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">📈</span>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Analýza dat</h3>
                                <p className="text-sm text-gray-600">
                                    Komplexní statistiky a trendy v oblasti nakládání s odpadem
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🎯</span>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Přístupnost</h3>
                                <p className="text-sm text-gray-600">
                                    Veřejně dostupné informace pro občany, úřady a odborníky
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center text-gray-400">
                        <p>&copy; 2025 EcoMap CZ | Projekt pro mapování spaloven v České republice</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}