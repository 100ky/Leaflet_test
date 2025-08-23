/**
 * TestPage - Testovací stránka pro demonstraci funkcionalit aplikace
 * Obsahuje interaktivní mapu, debug panely a ovládací prvky pro testování API
 */

'use client';

import dynamic from 'next/dynamic';
import {
    ApiTestPanel,
    DebugPanel,
    LiveDebugPanel,
    RegionDemo,
    RemoteApiStatusPanel,
    DataInfoPanel,
    QuickApiTestPanel,
    MapStatistics
} from '@/components';
import { IncineratorDataProvider, useIncineratorDataContext } from '@/contexts/IncineratorDataContext';
import { flyToRegion } from '@/utils/mapRegistry';

// Dynamický import komponenty mapy (pro SSR optimalizaci)
const Map = dynamic(() => import('@/components/map/Map'), {
    loading: () => (
        <div className="loading-center bg-gray-100 rounded-lg">
            <div className="text-gray-600">Načítání mapy...</div>
        </div>
    ),
    ssr: false
});

// Dynamický import DeveloperPanel
const DeveloperPanel = dynamic(() => import('@/components/panels/DeveloperPanel'), {
    ssr: false
});

/**
 * Vnitřní komponenta testu, která používá context
 */
function TestPageContent() {
    // Získání dat z contextu
    const {
        incinerators,
        loading,
        error,
        totalCount,
        clustered,
        usingRemoteApi,
        currentRegion,
        refetch,
        switchToRemoteApi,
        switchToLocalApi
    } = useIncineratorDataContext();

    return (
        <div className="test-page-bg test-page-stable">
            <header className="test-header">
                <div className="container mx-auto">
                    <h1 className="test-title">
                        <span className="hidden sm:inline">Test dynamického načítání dat</span>
                        <span className="sm:hidden">Test API</span>
                    </h1>
                    <p className="test-subtitle hidden sm:block">
                        Demonstrace API funkcí pro mapovou aplikaci spaloven
                    </p>
                </div>
            </header>

            <main className="test-main test-grid-stable">{/* Statistiky a monitoring - optimalizovaný responsive grid s tablet landscape podporou */}
                <div className="test-grid-responsive mb-3 sm:mb-4 lg:mb-6 test-grid-mobile test-grid-tablet-landscape test-grid-stable"
                    style={{ scrollBehavior: 'auto' }}>
                    {/* Hlavní statistiky - vždy nahoře na mobilu */}
                    <div className="md:col-span-1 lg:col-span-1">
                        <MapStatistics
                            incineratorsCount={incinerators.length}
                            loading={loading}
                            error={error}
                            totalCount={totalCount}
                            clustered={clustered}
                            region={currentRegion}
                        />
                    </div>

                    {/* API Status - důležité pro monitoring */}
                    <div className="lg:col-span-1">
                        <RemoteApiStatusPanel
                            usingRemoteApi={usingRemoteApi}
                            loading={loading}
                            error={error}
                            onSwitchToRemote={switchToRemoteApi}
                            onSwitchToLocal={switchToLocalApi}
                        />
                    </div>

                    {/* Data Info */}
                    <div className="lg:col-span-1">
                        <DataInfoPanel
                            incinerators={incinerators}
                            loading={loading}
                            error={error}
                            usingRemoteApi={usingRemoteApi}
                            currentRegion={currentRegion}
                        />
                    </div>

                    {/* Live Debug - skryto na menších obrazovkách */}
                    <div className="hidden lg:block lg:col-span-1">
                        <LiveDebugPanel />
                    </div>
                </div>

                {/* Další panely - skryté na mobilu, zobrazené na tabletu+ */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6 test-grid-mobile test-grid-tablet-landscape">
                    <RegionDemo onRegionSelect={flyToRegion} />
                    <div className="lg:col-span-1">
                        <QuickApiTestPanel />
                    </div>
                </div>

                {/* Hlavní obsah - optimalizovaný layout s rozšířenou mapou */}
                <div className="test-grid-two-col test-grid-mobile test-grid-tablet-landscape">
                    {/* Mapa - plná šířka */}
                    <div className="test-map-section">
                        <div className="panel-main overflow-hidden">
                            <div className="test-map-header">
                                <h2 className="test-map-title">
                                    <span className="hidden sm:inline">Interaktivní mapa s dynamickým načítáním</span>
                                    <span className="sm:hidden">Mapa spaloven</span>
                                </h2>
                                <p className="test-map-subtitle hidden sm:block">
                                    Data se načítají podle aktuálního pohledu a zoom úrovně
                                </p>
                                <div className="test-map-controls">
                                    <span className={`test-api-badge ${usingRemoteApi ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                        {usingRemoteApi ? 'Vzdálené API' : 'Lokální API'}
                                    </span>
                                    <button
                                        onClick={refetch}
                                        className="test-refresh-btn"
                                        disabled={loading}
                                    >
                                        {loading ? 'Načítám...' : 'Obnovit data'}
                                    </button>
                                </div>
                            </div>

                            <div className="test-map-container test-map-mobile test-map-ultra-mobile test-map-tablet-landscape" style={{ height: 'clamp(400px, 70vh, 800px)' }}>
                                <Map />
                            </div>
                        </div>
                    </div>

                    {/* Test panely - pod mapou */}
                    <div className="test-panel-section test-panel-mobile test-panel-tablet-landscape">
                        {/* API Test Panel je vždy viditelný */}
                        <ApiTestPanel />

                        {/* Mobile-only kompaktní region selector */}
                        <div className="block md:hidden">
                            <RegionDemo onRegionSelect={flyToRegion} />
                        </div>
                    </div>
                </div>

                {/* Dokumentace - kompaktní na mobilu a optimalizovaná pro tablet landscape */}
                <div className="test-docs-section test-panel-mobile test-ultra-mobile test-docs-tablet-landscape">
                    <h2 className="test-docs-title test-text-tablet-landscape">
                        <span className="hidden sm:inline">Dokumentace funkcí</span>
                        <span className="sm:hidden">Funkce aplikace</span>
                    </h2>

                    <div className="test-docs-grid test-grid-mobile test-grid-tablet-landscape">
                        <div>
                            <h3 className="test-docs-section-title text-sm sm:text-base lg:text-lg">
                                🔄 <span className="hidden sm:inline">Dynamické načítání dat</span>
                                <span className="sm:hidden">Načítání dat</span>
                            </h3>
                            <ul className="test-docs-list">
                                <li>Automatické načítání při změně viewport</li>
                                <li className="hidden sm:list-item">Implementována detekce změn s tolerancí pro prevenci zbytečných volání</li>
                                <li>Clustering při nízkých zoom úrovních</li>
                                <li>Cache systém pro rychlejší načítání</li>
                            </ul>
                        </div>

                        <div className="hidden md:block">
                            <h3 className="test-docs-section-title text-base lg:text-lg">
                                ⚡ Prediktivní načítání
                            </h3>
                            <ul className="test-docs-list">
                                <li>Asynchronní načítání dat pro sousední oblasti</li>
                                <li>Debounced prefetch s 2s zpožděním</li>
                                <li>10% rozšíření hranic pro předem načtená data</li>
                                <li>Pouze pro lokální API</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="test-docs-section-title text-sm sm:text-base lg:text-lg">
                                🌐 <span className="hidden sm:inline">Duální API podpora</span>
                                <span className="sm:hidden">API zdroje</span>
                            </h3>
                            <ul className="test-docs-list">
                                <li><strong>Lokální:</strong> Rychlé, kompletní data</li>
                                <li><strong>Vzdálené:</strong> Live data z combustion.radek18.com</li>
                                <li className="hidden sm:list-item">Automatické přepnutí při selhání</li>
                                <li className="hidden sm:list-item">Robustní error handling</li>
                            </ul>
                        </div>

                        {/* Skryté detaily na malých obrazovkách */}
                        <div className="hidden lg:block">
                            <h3 className="test-docs-section-title text-base lg:text-lg">
                                🔧 Testovací nástroje
                            </h3>
                            <ul className="test-docs-list">
                                <li><strong>API Status Panel:</strong> Monitoring a přepínání</li>
                                <li><strong>Data Info Panel:</strong> Analýza kvality dat</li>
                                <li><strong>Quick Test Panel:</strong> Rychlé porovnání API</li>
                                <li><strong>Live Debug:</strong> Real-time monitoring</li>
                                <li><strong>Region Demo:</strong> Testování oblastí</li>
                            </ul>
                        </div>

                        <div className="hidden md:block">
                            <h3 className="test-docs-section-title text-base lg:text-lg">
                                📊 Implementované funkce
                            </h3>
                            <ul className="test-docs-list">
                                <li>Regionální simulace s variabilními loading časy</li>
                                <li>Enhanced logging systém s emoji ikonami</li>
                                <li>MapRegistry pro globální správu mapy</li>
                                <li>FlyToRegion funkcionalita</li>
                                <li>Connection testing s fallback mechanismy</li>
                                <li>Real-time statistiky a monitoring</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="test-docs-section-title text-sm sm:text-base lg:text-lg">
                                🎯 <span className="hidden sm:inline">Adaptivní zobrazení</span>
                                <span className="sm:hidden">Zoom úrovně</span>
                            </h3>
                            <ul className="test-docs-list">
                                <li>Zoom &lt; 10: Clustering markerů</li>
                                <li>Zoom 10-12: Základní markery</li>
                                <li>Zoom ≥ 12: Detailní pohled s polygony</li>
                                <li className="hidden sm:list-item">Dynamické přepínání mezi režimy</li>
                            </ul>
                        </div>

                        <div className="hidden lg:block">
                            <h3 className="test-docs-section-title text-base lg:text-lg">
                                🔧 Optimalizace výkonu
                            </h3>
                            <ul className="test-docs-list">
                                <li>Prevence duplicitních API volání</li>
                                <li>Cache s TTL (5 minut)</li>
                                <li>Geografické filtrování podle viewport</li>
                                <li>Debouncing pro viewport změny</li>
                                <li>Lazy loading komponent</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            {/* Debug Panel */}
            <DebugPanel />

            {/* Developer Panel */}
            <DeveloperPanel />
        </div>
    );
}

/**
 * Hlavní komponenta stránky s context providerem
 */
export default function TestPage() {
    return (
        <IncineratorDataProvider enablePrefetch={true} useRemoteApi={false}>
            <TestPageContent />
        </IncineratorDataProvider>
    );
}
