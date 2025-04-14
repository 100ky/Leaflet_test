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
  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      {/* Hlavní nadpis stránky */}
      <h1 className="text-3xl font-bold mb-4">Mapa spaloven v ČR</h1>
      
      {/* Kontejner pro mapu s omezenou maximální šířkou */}
      <div className="w-full max-w-5xl">
        <Map incinerators={incineratorData} />
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
