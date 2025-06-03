/**
 * HomePage - Hlavní stránka aplikace
 * Zobrazuje interaktivní mapu spaloven v České republice
 */

'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { IncineratorDataProvider } from '@/contexts/IncineratorDataContext';

// Dynamický import komponenty mapy (Leaflet vyžaduje přístup k window objektu)
const Map = dynamic(() => import('@/components/Map/Map'), {
  loading: () => <p>Načítání mapy...</p>,
  ssr: false // Vypnutí server-side renderingu
});

/**
 * Hlavní stránka aplikace - zobrazuje mapu spaloven v ČR
 */
export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className="page-header">
        <div className="container mx-auto">
          <h1 className="page-title">
            Mapa spaloven v ČR
          </h1>
        </div>
      </header>

      <main className="page-main">
        {/* Úvod */}
        <div className="page-intro">
          <h2 className="page-intro-title">Interaktivní mapa spaloven odpadů</h2>
          <p className="page-intro-text">
            Prohlédněte si přehlednou mapu spaloven v České republice s možností zobrazení detailů jednotlivých zařízení a jejich areálů.
          </p>
        </div>

        {/* Legenda */}
        <div className="legend-container">
          <div className="legend-item">
            <span className="legend-dot bg-secondary"></span>
            <span className="legend-text">V provozu</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot bg-primary"></span>
            <span className="legend-text">Plánovaná výstavba</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot bg-red-500"></span>
            <span className="legend-text">Mimo provoz</span>
          </div>
        </div>

        {/* Kontejner pro mapu s vylepšeným vzhledem */}
        <div className="map-container">
          <IncineratorDataProvider>
            <Map />
          </IncineratorDataProvider>
        </div>

        {/* Informační text pod mapou */}
        <div className="info-section">
          <div className="info-header">
            <div className="info-icon">💡</div>
            <div>
              <h3 className="info-title">Tipy pro práci s mapou</h3>
              <ul className="info-list">
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
      <footer className="page-footer">
        <div className="footer-content">
          <div className="footer-text">
            &copy; {mounted ? new Date().getFullYear() : 2025} Mapa spaloven ČR | Data: <a href="https://www.openstreetmap.org/copyright" className="underline hover:text-primary transition-colors">OpenStreetMap</a>
          </div>
        </div>
      </footer>
    </>
  );
}
