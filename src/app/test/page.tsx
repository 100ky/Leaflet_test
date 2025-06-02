/**
 * TestPage - Testovací stránka pro demonstraci funkcionalit aplikace
 * Obsahuje interaktivní mapu, debug panely a ovládací prvky pro testování API
 */

'use client';

import dynamic from 'next/dynamic';
import { ApiTestPanel } from '@/components/ApiTestPanel';
import { DebugPanel } from '@/components/DebugPanel';
import MapStatistics from '@/components/MapStatistics';
import { LiveDebugPanel } from '@/components/LiveDebugPanel';
import { RegionDemo } from '@/components/RegionDemo';
import { RemoteApiStatusPanel } from '@/components/RemoteApiStatusPanel';
import { DataInfoPanel } from '@/components/DataInfoPanel';
import { QuickApiTestPanel } from '@/components/QuickApiTestPanel';
import { IncineratorDataProvider, useIncineratorDataContext } from '@/contexts/IncineratorDataContext';
import { flyToRegion } from '@/utils/mapRegistry';

// Dynamický import komponenty mapy (pro SSR optimalizaci)
const Map = dynamic(() => import('@/components/Map/Map'), {
    loading: () => (
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
            <div className="text-gray-600">Načítání mapy...</div>
        </div>
    ),
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
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b p-2 sm:p-3 lg:p-4 test-header-tablet-landscape">
                <div className="container mx-auto">
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                        <span className="hidden sm:inline">Test dynamického načítání dat</span>
                        <span className="sm:hidden">Test API</span>
                    </h1>
                    <p className="text-gray-600 mt-1 text-xs sm:text-sm lg:text-base hidden sm:block">
                        Demonstrace API funkcí pro mapovou aplikaci spaloven
                    </p>
                </div>
            </header>

            <main className="container mx-auto py-2 sm:py-4 lg:py-6 px-2 sm:px-4 test-page-mobile">
                {/* Statistiky a monitoring - optimalizovaný responsive grid s tablet landscape podporou */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6 test-grid-mobile test-grid-tablet-landscape">
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
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6 test-grid-mobile test-grid-tablet-landscape">
                    <RegionDemo onRegionSelect={flyToRegion} />
                    <div className="lg:col-span-1">
                        <QuickApiTestPanel />
                    </div>
                    <div className="hidden lg:block">
                        <LiveDebugPanel />
                    </div>
                </div>

                {/* Hlavní obsah - optimalizovaný layout pro mobilní zařízení a tablet landscape */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 test-grid-mobile test-grid-tablet-landscape">
                    {/* Mapa - plná šířka na mobilu, 3/4 na desktopu */}
                    <div className="lg:col-span-3 order-1">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-3 sm:p-4 border-b">
                                <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                                    <span className="hidden sm:inline">Interaktivní mapa s dynamickým načítáním</span>
                                    <span className="sm:hidden">Mapa spaloven</span>
                                </h2>
                                <p className="text-gray-600 text-xs sm:text-sm mt-1 hidden sm:block">
                                    Data se načítají podle aktuálního pohledu a zoom úrovně
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs ${usingRemoteApi ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                        {usingRemoteApi ? 'Vzdálené API' : 'Lokální API'}
                                    </span>
                                    <button
                                        onClick={refetch}
                                        className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors"
                                        disabled={loading}
                                    >
                                        {loading ? 'Načítám...' : 'Obnovit data'}
                                    </button>
                                </div>
                            </div>

                            <div className="relative test-map-mobile test-map-ultra-mobile test-map-tablet-landscape" style={{ height: 'clamp(200px, 35vh, 400px)' }}>
                                <Map />
                            </div>
                        </div>
                    </div>

                    {/* Test panely - optimalizované pro mobil a tablet landscape */}
                    <div className="lg:col-span-1 order-2 space-y-2 sm:space-y-3 test-panel-mobile test-panel-tablet-landscape">
                        {/* API Test Panel je vždy viditelný */}
                        <ApiTestPanel />

                        {/* Quick API Test - viditelný pouze na tabletu+ */}
                        <div className="hidden md:block">
                            <QuickApiTestPanel />
                        </div>

                        {/* Mobile-only kompaktní region selector */}
                        <div className="block md:hidden">
                            <RegionDemo onRegionSelect={flyToRegion} />
                        </div>
                    </div>
                </div>

                {/* Dokumentace - kompaktní na mobilu a optimalizovaná pro tablet landscape */}
                <div className="mt-3 sm:mt-4 lg:mt-6 bg-white rounded-lg shadow-lg p-2 sm:p-3 lg:p-4 test-panel-mobile test-ultra-mobile test-docs-tablet-landscape">
                    <h2 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 mb-2 sm:mb-3 test-text-tablet-landscape">
                        <span className="hidden sm:inline">Dokumentace funkcí</span>
                        <span className="sm:hidden">Funkce aplikace</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 test-grid-mobile test-grid-tablet-landscape">
                        <div>
                            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-2">
                                🔄 <span className="hidden sm:inline">Dynamické načítání dat</span>
                                <span className="sm:hidden">Načítání dat</span>
                            </h3>
                            <ul className="text-gray-600 space-y-1 text-xs sm:text-sm list-disc pl-4 sm:pl-5">
                                <li>Automatické načítání při změně viewport</li>
                                <li className="hidden sm:list-item">Implementována detekce změn s tolerancí pro prevenci zbytečných volání</li>
                                <li>Clustering při nízkých zoom úrovních</li>
                                <li>Cache systém pro rychlejší načítání</li>
                            </ul>
                        </div>

                        <div className="hidden md:block">
                            <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-2">
                                ⚡ Prediktivní načítání
                            </h3>
                            <ul className="text-gray-600 space-y-1 text-xs sm:text-sm list-disc pl-4 sm:pl-5">
                                <li>Asynchronní načítání dat pro sousední oblasti</li>
                                <li>Debounced prefetch s 2s zpožděním</li>
                                <li>10% rozšíření hranic pro předem načtená data</li>
                                <li>Pouze pro lokální API</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-2">
                                🌐 <span className="hidden sm:inline">Duální API podpora</span>
                                <span className="sm:hidden">API zdroje</span>
                            </h3>
                            <ul className="text-gray-600 space-y-1 text-xs sm:text-sm list-disc pl-4 sm:pl-5">
                                <li><strong>Lokální:</strong> Rychlé, kompletní data</li>
                                <li><strong>Vzdálené:</strong> Live data z combustion.radek18.com</li>
                                <li className="hidden sm:list-item">Automatické přepnutí při selhání</li>
                                <li className="hidden sm:list-item">Robustní error handling</li>
                            </ul>
                        </div>

                        {/* Skryté detaily na malých obrazovkách */}
                        <div className="hidden lg:block">
                            <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-2">
                                🔧 Testovací nástroje
                            </h3>
                            <ul className="text-gray-600 space-y-1 text-xs sm:text-sm list-disc pl-4 sm:pl-5">
                                <li><strong>API Status Panel:</strong> Monitoring a přepínání</li>
                                <li><strong>Data Info Panel:</strong> Analýza kvality dat</li>
                                <li><strong>Quick Test Panel:</strong> Rychlé porovnání API</li>
                                <li><strong>Live Debug:</strong> Real-time monitoring</li>
                                <li><strong>Region Demo:</strong> Testování oblastí</li>
                            </ul>
                        </div>

                        <div className="hidden md:block">
                            <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-2">
                                📊 Implementované funkce
                            </h3>
                            <ul className="text-gray-600 space-y-1 text-xs sm:text-sm list-disc pl-4 sm:pl-5">
                                <li>Regionální simulace s variabilními loading časy</li>
                                <li>Enhanced logging systém s emoji ikonami</li>
                                <li>MapRegistry pro globální správu mapy</li>
                                <li>FlyToRegion funkcionalita</li>
                                <li>Connection testing s fallback mechanismy</li>
                                <li>Real-time statistiky a monitoring</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-2">
                                🎯 <span className="hidden sm:inline">Adaptivní zobrazení</span>
                                <span className="sm:hidden">Zoom úrovně</span>
                            </h3>
                            <ul className="text-gray-600 space-y-1 text-xs sm:text-sm list-disc pl-4 sm:pl-5">
                                <li>Zoom &lt; 10: Clustering markerů</li>
                                <li>Zoom 10-12: Základní markery</li>
                                <li>Zoom ≥ 12: Detailní pohled s polygony</li>
                                <li className="hidden sm:list-item">Dynamické přepínání mezi režimy</li>
                            </ul>
                        </div>

                        <div className="hidden lg:block">
                            <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-2">
                                🔧 Optimalizace výkonu
                            </h3>
                            <ul className="text-gray-600 space-y-1 text-xs sm:text-sm list-disc pl-4 sm:pl-5">
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
