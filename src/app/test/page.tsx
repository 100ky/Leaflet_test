/**
 * Test stránka pro demonstraci dynamického načítání dat
 */

'use client';

import dynamic from 'next/dynamic';
import { ApiTestPanel } from '@/components/ApiTestPanel';
import { DebugPanel } from '@/components/DebugPanel';
import MapStatistics from '@/components/MapStatistics2';
import { LiveDebugPanel } from '@/components/LiveDebugPanel';
import { RegionDemo } from '@/components/RegionDemo';
import { RemoteApiStatusPanel } from '@/components/RemoteApiStatusPanel';
import { DataInfoPanel } from '@/components/DataInfoPanel';
import { QuickApiTestPanel } from '@/components/QuickApiTestPanel';
import { IncineratorDataProvider, useIncineratorDataContext } from '@/contexts/IncineratorDataContext';
import { flyToRegion } from '@/utils/mapRegistry';

// Dynamický import komponenty mapy
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

    return (<div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b p-3 sm:p-4">
            <div className="container mx-auto">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-responsive">
                    Test dynamického načítání dat
                </h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base text-responsive">
                    Demonstrace API funkcí pro mapovou aplikaci spaloven
                </p>
            </div>
        </header><main className="container mx-auto py-4 sm:py-6 lg:py-8 px-4">
            {/* Statistiky a monitoring - responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 mb-6">
                <div className="sm:col-span-2 lg:col-span-1">
                    <MapStatistics
                        incineratorsCount={incinerators.length}
                        loading={loading}
                        error={error}
                        totalCount={totalCount}
                        clustered={clustered}
                        region={currentRegion}
                    />
                </div>
                <DataInfoPanel
                    incinerators={incinerators}
                    loading={loading}
                    error={error}
                    usingRemoteApi={usingRemoteApi}
                    currentRegion={currentRegion}
                />
                <RemoteApiStatusPanel
                    usingRemoteApi={usingRemoteApi}
                    loading={loading}
                    error={error}
                    onSwitchToRemote={switchToRemoteApi}
                    onSwitchToLocal={switchToLocalApi}
                />
                <div className="sm:col-span-2 lg:col-span-1">
                    <LiveDebugPanel />
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                    <RegionDemo onRegionSelect={flyToRegion} />
                </div>
            </div>

            {/* Hlavní obsah - flexibilní layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
                {/* Mapa - responzivní velikost */}
                <div className="xl:col-span-2 order-2 xl:order-1">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-3 sm:p-4 border-b">
                            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                                Interaktivní mapa s dynamickým načítáním
                            </h2>
                            <p className="text-gray-600 text-xs sm:text-sm mt-1">
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
                        <div className="relative" style={{ height: 'clamp(400px, 50vh, 600px)' }}>
                            <Map />
                        </div>
                    </div>
                </div>

                {/* Test panely - stack na mobilech */}
                <div className="xl:col-span-1 order-1 xl:order-2 space-y-4 lg:space-y-6">
                    <ApiTestPanel />
                    <QuickApiTestPanel />
                </div>
            </div>                {/* Dokumentace - responzivní */}
            <div className="mt-6 lg:mt-8 bg-white rounded-lg shadow-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                    Dokumentace funkcí
                </h2>

                <div className="space-y-4 sm:space-y-6">
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                            🔄 Dynamické načítání dat
                        </h3>
                        <ul className="text-gray-600 space-y-1 text-xs sm:text-sm list-disc pl-4 sm:pl-5">
                            <li>Data se načítají automaticky při změně viewport (posunutí nebo zoom)</li>
                            <li>Implementována detekce změn s tolerancí pro prevenci zbytečných volání</li>
                            <li>Podpora pro clustering při nízkých zoom úrovních (&lt; 10)</li>
                            <li>Cache systém pro rychlejší opakované načítání</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                            ⚡ Prediktivní načítání
                        </h3>
                        <ul className="text-gray-600 space-y-1 text-xs sm:text-sm list-disc pl-4 sm:pl-5">
                            <li>Asynchronní načítání dat pro sousední oblasti</li>
                            <li>Debounced prefetch s 2s zpožděním po uklidnění pohybu</li>
                            <li>10% rozšíření hranic pro předem načtená data</li>
                            <li>Pouze pro lokální API (u vzdáleného API by mohlo způsobit zbytečnou zátěž)</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                            🌐 Duální API podpora
                        </h3>
                        <ul className="text-gray-600 space-y-1 text-xs sm:text-sm list-disc pl-4 sm:pl-5">
                            <li><strong>Lokální API:</strong> Rychlé, kompletní data s geometrií budov</li>
                            <li><strong>Vzdálené API:</strong> Live data z https://combustion.radek18.com/api/incinerators</li>
                            <li>Automatické přepnutí na lokální data při selhání vzdáleného API</li>
                            <li>Transformace dat pro konzistentní interface</li>
                            <li>Detekce timeoutů a robustní error handling</li>
                        </ul>
                    </div>

                    {/* Skryté detaily na malých obrazovkách */}
                    <div className="hidden sm:block">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                            🔧 Testovací nástroje
                        </h3>
                        <ul className="text-gray-600 space-y-1 text-xs sm:text-sm list-disc pl-4 sm:pl-5">
                            <li><strong>Remote API Status Panel:</strong> Monitoring stavu a přepínání mezi API</li>
                            <li><strong>Data Info Panel:</strong> Analýza kvality a úplnosti načtených dat</li>
                            <li><strong>Quick API Test Panel:</strong> Rychlé testování a porovnání obou API</li>
                            <li><strong>Live Debug Panel:</strong> Real-time monitoring API komunikace</li>
                            <li><strong>Region Demo:</strong> Testování různých geografických oblastí</li>
                        </ul>
                    </div>

                    <div className="hidden md:block">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                            📊 Implementované funkce
                        </h3>
                        <ul className="text-gray-600 space-y-1 text-xs sm:text-sm list-disc pl-4 sm:pl-5">
                            <li>Regionální simulace s variabilními loading časy (Praha, Brno, Ostrava, atd.)</li>
                            <li>Enhanced logging systém s emoji ikonami a barevným logováním</li>
                            <li>MapRegistry systém pro globální správu reference mapy</li>
                            <li>FlyToRegion funkcionalita pro programové přesuny mapy</li>
                            <li>Connection testing s fallback mechanismy</li>
                            <li>Data transformation a validace pro vzdálené API</li>
                            <li>Real-time statistiky a monitoring komponent</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                            🎯 Adaptivní zobrazení
                        </h3>
                        <ul className="text-gray-600 space-y-1 text-xs sm:text-sm list-disc pl-4 sm:pl-5">
                            <li>Zoom &lt; 10: Clustering markerů</li>
                            <li>Zoom 10-12: Základní markery spaloven</li>
                            <li>Zoom ≥ 12: Detailní pohled s polygony areálů a budov</li>
                            <li>Dynamické přepínání mezi režimy zobrazení</li>
                        </ul>
                    </div>

                    <div className="hidden lg:block">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                            🔧 Optimalizace výkonu
                        </h3>
                        <ul className="text-gray-600 space-y-1 text-xs sm:text-sm list-disc pl-4 sm:pl-5">
                            <li>Prevence duplicitních API volání</li>
                            <li>Cache s TTL (5 minut)</li>
                            <li>Geografické filtrování dat podle viewport</li>
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
