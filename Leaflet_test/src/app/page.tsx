/**
 * HomePage - Hlavní stránka aplikace s moderním designem
 * Zobrazuje hero sekci a interaktivní mapu spaloven v České republice
 */

'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { IncineratorDataProvider } from '@/contexts/IncineratorDataContext';
import Navigation from '@/components/ui/Navigation';

// Dynamický import komponenty mapy (Leaflet vyžaduje přístup k window objektu)
const Map = dynamic(() => import('@/components/map/Map'), {
  loading: () => <div className="flex items-center justify-center h-96 text-gray-600">Načítání mapy...</div>,
  ssr: false // Vypnutí server-side renderingu
});

/**
 * Hlavní stránka aplikace - zobrazuje hero sekci a mapu spaloven v ČR
 */
export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToMap = () => {
    document.getElementById('mapa')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero sekce inspirovaná 3. variantou */}
      <section className="bg-gray-900 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-6">
                Průzkum spaloven
                <span className="block text-green-400">České republiky</span>
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Získejte přehled o všech spalovnách odpadu v ČR. Detailní informace o kapacitách, technologiích a aktuálním stavu provozu na interaktivní mapě.
              </p>
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={scrollToMap}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Začít průzkum
                </button>
                <button className="border border-gray-600 text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Dokumentace
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-64 h-64 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-6xl">🗺️</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Funkce aplikace */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Funkce aplikace</h2>
            <p className="text-lg text-gray-600">Vše co potřebujete pro analýzu spaloven odpadu</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
              </div>              <h3 className="text-xl font-semibold mb-3 text-gray-900">Detailní data</h3>
              <p className="text-gray-800">
                Kompletní informace o kapacitě, technologiích a provozu každé spalovny v České republice
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🗺️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Interaktivní mapa</h3>
              <p className="text-gray-800">
                Intuitivní ovládání s podporou zoom, filtrování a detailních pohledů na areály
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Real-time data</h3>
              <p className="text-gray-800">
                Aktuální informace z lokálních i vzdálených zdrojů s možností přepínání
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legenda */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-900">Legenda mapy</h3>
            <div className="flex justify-center gap-8 flex-wrap">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                <span className="text-sm font-medium text-gray-800">V provozu</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
                <span className="text-sm font-medium text-gray-800">Plánovaná výstavba</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-red-500 rounded-full"></span>
                <span className="text-sm font-medium text-gray-800">Mimo provoz</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa */}
      <section id="mapa" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Interaktivní mapa</h2>
            <p className="text-lg text-gray-600">Prozkoumejte spalovny v České republice</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <IncineratorDataProvider>
              <Map />
            </IncineratorDataProvider>
          </div>
        </div>
      </section>

      {/* Tipy pro používání */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-blue-50 rounded-xl p-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl">💡</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Tipy pro práci s mapou</h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Klikněte na značku pro zobrazení podrobností o konkrétní spalovně</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Přibližte mapu nad úroveň 12 pro zobrazení detailního areálu spalovny</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Dvojklikem na značku se přiblížíte přímo na danou spalovnu</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Použijte tlačítko ⟲ pro návrat na celkový pohled České republiky</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-gray-400">
            <p>&copy; {mounted ? new Date().getFullYear() : 2025} České spalovny | Data: <a href="https://www.openstreetmap.org/copyright" className="text-green-400 hover:text-green-300 transition-colors">OpenStreetMap</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
