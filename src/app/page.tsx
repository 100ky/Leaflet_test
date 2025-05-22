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
    <>
      {/* Záhlaví stránky */}
      <header className="sticky top-0 z-10 w-full bg-header-bg dark:bg-header-bg shadow-md border-b border-border p-4 backdrop-blur-sm">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-primary">
            Mapa spaloven v ČR
          </h1>
        </div>
      </header>

      <main className="flex min-h-screen flex-col items-center py-8 px-4">
        {/* Krátký úvod */}
        <div className="w-full max-w-5xl mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-foreground">Interaktivní mapa spaloven odpadů</h2>
          <p className="text-foreground opacity-80 mb-6 max-w-3xl">
            Prohlédněte si přehlednou mapu spaloven v České republice s možností zobrazení detailů jednotlivých zařízení a jejich areálů.
          </p>
        </div>

        {/* Krátká legenda */}
        <div className="w-full max-w-5xl mb-4 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-secondary"></span>
            <span className="text-sm text-foreground">V provozu</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-primary"></span>
            <span className="text-sm text-foreground">Plánovaná výstavba</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-red-500"></span>
            <span className="text-sm text-foreground">Mimo provoz</span>
          </div>
        </div>

        {/* Kontejner pro mapu s vylepšeným vzhledem */}
        <div className="w-full max-w-5xl bg-card dark:bg-card rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <Map incinerators={incineratorData} />
        </div>

        {/* Informační text pod mapou */}
        <div className="w-full max-w-5xl mt-6 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-5 rounded-lg shadow-sm">
          <div className="flex items-start gap-3">
            <div className="text-blue-500 text-xl">💡</div>
            <div>
              <h3 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Tipy pro práci s mapou</h3>
              <ul className="text-foreground/80 text-sm space-y-1 list-disc pl-4">
                <li>Klikněte na značku pro zobrazení podrobností o konkrétní spalovně</li>
                <li>Přibližte mapu nad úroveň 12 pro zobrazení detailního areálu spalovny</li>
                <li>Dvojklikem na značku se přiblížíte přímo na danou spalovnu</li>
                <li>Použijte tlačítko ⟲ pro návrat na celkový pohled České republiky</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Patička */}
      <footer className="w-full bg-card dark:bg-card p-6 mt-8 border-t border-border">
        <div className="container mx-auto text-center">
          <div className="text-foreground/70 text-sm">
            &copy; {new Date().getFullYear()} Mapa spaloven ČR | Data: <a href="https://www.openstreetmap.org/copyright" className="underline hover:text-primary transition-colors">OpenStreetMap</a>
          </div>
        </div>
      </footer>
    </>
  );
}
