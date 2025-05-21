'use client';

import dynamic from 'next/dynamic';
import incineratorData from '@/data/incinerators';

// Dynamický import mapové komponenty - řeší problémy s vykreslováním na serveru (SSR)
// Leaflet vyžaduje přístup k window objektu, který na serveru neexistuje
const Map = dynamic(() => import('@/components/Map/Map'), {
  loading: () => <p>Načítání mapy...</p>, // Zobrazí se během načítání komponenty
  ssr: false // Vypnutí vykreslování na serveru
});

/**
 * Hlavní stránka aplikace
 * Zobrazuje nadpis, mapu spaloven a krátký popisek
 */
export default function Home() {
  return (<main className="flex min-h-screen flex-col items-center p-4">
    {/* Hlavní nadpis stránky */}
    <h1 className="text-3xl font-bold mb-4">Mapa spaloven v ČR</h1>

    {/* Kontejner pro mapu s omezenou maximální šířkou */}
    <div className="w-full max-w-5xl">
      <Map incinerators={incineratorData} />
    </div>

    {/* Nástroje a užitečné odkazy */}
    <div className="w-full max-w-5xl mt-6">
      <h2 className="text-xl font-bold mb-2">Nástroje pro vývoj:</h2>      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">        <a href="/verify-coordinates" className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition">
        <h3 className="font-bold">Ověření souřadnic</h3>
        <p className="text-sm text-gray-600">Kontrola správného umístění spaloven na mapě.</p>
      </a>
        <a href="/polygon-sync" className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition">
          <h3 className="font-bold">Synchronizace polygonů</h3>
          <p className="text-sm text-gray-600">Zarovnání polygonů pozemků a budov se značkami spaloven.</p>
        </a>
        <a href="/update-coordinates" className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition">
          <h3 className="font-bold">Aktualizace souřadnic</h3>
          <p className="text-sm text-gray-600">Nástroj pro aktualizaci souřadnic spaloven pomoci geokódování.</p>
        </a>
        <a href="/incinerator-coordinates-updater" className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition">
          <h3 className="font-bold">Hromadná aktualizace souřadnic</h3>
          <p className="text-sm text-gray-600">Nástroj pro hromadnou aktualizaci souřadnic všech spaloven.</p>
        </a>
        <a href="/geojson-updater" className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition">
          <h3 className="font-bold">GeoJSON aktualizace</h3>
          <p className="text-sm text-gray-600">Generátor kódu pro aktualizaci polygonů GeoJSON.</p>
        </a>
        <a href="/geojson-fixer" className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition">
          <h3 className="font-bold">GeoJSON vizualizace</h3>
          <p className="text-sm text-gray-600">Vizualizace a kontrola GeoJSON objektů na mapě.</p>
        </a>
        <a href="/coordinate-converter" className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition">
          <h3 className="font-bold">Konverze souřadnic</h3>
          <p className="text-sm text-gray-600">Převod mezi různými formáty geografických souřadnic.</p>
        </a>
        <a href="/test-nominatim" className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition">
          <h3 className="font-bold">Test Nominatim API</h3>
          <p className="text-sm text-gray-600">Testování geokódovací služby Nominatim.</p>
        </a>
      </div>
    </div>

    {/* Informační text pod mapou */}
    <div className="mt-4">
      <p className="text-gray-600 text-sm">
        Tato aplikace zobrazuje přehled spaloven odpadů v České republice.
        Klikněte na značku pro zobrazení podrobností o konkrétní spalovně.
      </p>
    </div>
  </main>
  );
}
