/**
 * Test stránka pro demonstraci dynamického načítání dat
 */

'use client';

import dynamic from 'next/dynamic';
import { ApiTestPanel } from '@/components/ApiTestPanel';
import { DebugPanel } from '@/components/DebugPanel';
import MapStatistics from '@/components/MapStatistics2';
import { IncineratorDataProvider, useIncineratorDataContext } from '@/contexts/IncineratorDataContext';

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
        refetch,
        switchToRemoteApi,
        switchToLocalApi
    } = useIncineratorDataContext();

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b p-4">
                <div className="container mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Test dynamického načítání dat
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Demonstrace API funkcí pro mapovou aplikaci spaloven
                    </p>
                </div>
            </header>

            <main className="container mx-auto py-8 px-4">
                {/* Statistiky mapy - nahoře */}
                <div className="mb-6">
                    <MapStatistics
                        incineratorsCount={incinerators.length}
                        loading={loading}
                        error={error}
                        totalCount={totalCount}
                        clustered={clustered}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Mapa - 2/3 šířky */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-4 border-b">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Interaktivní mapa s dynamickým načítáním
                                </h2>
                                <p className="text-gray-600 text-sm mt-1">
                                    Data se načítají podle aktuálního pohledu a zoom úrovně
                                </p>
                                <div className="mt-2 flex items-center space-x-4 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs ${usingRemoteApi ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                        {usingRemoteApi ? 'Vzdálené API' : 'Lokální API'}
                                    </span>
                                    <button
                                        onClick={usingRemoteApi ? switchToLocalApi : switchToRemoteApi}
                                        className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                                    >
                                        Přepnout na {usingRemoteApi ? 'lokální' : 'vzdálené'} API
                                    </button>
                                    <button
                                        onClick={refetch}
                                        className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors"
                                        disabled={loading}
                                    >
                                        {loading ? 'Načítám...' : 'Obnovit data'}
                                    </button>
                                </div>
                            </div>
                            <div className="relative" style={{ height: '600px' }}>
                                <Map />
                            </div>
                        </div>
                    </div>

                    {/* Test panel - 1/3 šířky */}
                    <div className="lg:col-span-1">
                        <ApiTestPanel />
                    </div>
                </div>

                {/* Dokumentace */}
                <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Dokumentace funkcí
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                🔄 Dynamické načítání dat
                            </h3>
                            <ul className="text-gray-600 space-y-1 text-sm list-disc pl-5">
                                <li>Data se načítají automaticky při změně viewport (posunutí nebo zoom)</li>
                                <li>Implementována detekce změn s tolerancí pro prevenci zbytečných volání</li>
                                <li>Podpora pro clustering při nízkých zoom úrovních (&lt; 10)</li>
                                <li>Cache systém pro rychlejší opakované načítání</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                ⚡ Prediktivní načítání
                            </h3>
                            <ul className="text-gray-600 space-y-1 text-sm list-disc pl-5">
                                <li>Asynchronní načítání dat pro sousední oblasti</li>
                                <li>Debounced prefetch s 2s zpožděním po uklidnění pohybu</li>
                                <li>10% rozšíření hranic pro předem načtená data</li>
                                <li>Pouze pro lokální API (u vzdáleného API by mohlo způsobit zbytečnou zátěž)</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                🌐 Duální API podpora
                            </h3>
                            <ul className="text-gray-600 space-y-1 text-sm list-disc pl-5">
                                <li><strong>Lokální API:</strong> Rychlé, kompletní data s geometrií budov</li>
                                <li><strong>Vzdálené API:</strong> Live data z https://combustion.radek18.com/api/incinerators</li>
                                <li>Automatické přepnutí na lokální data při selhání vzdáleného API</li>
                                <li>Transformace dat pro konzistentní interface</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                🎯 Adaptivní zobrazení
                            </h3>
                            <ul className="text-gray-600 space-y-1 text-sm list-disc pl-5">
                                <li>Zoom &lt; 10: Clustering markerů</li>
                                <li>Zoom 10-12: Základní markery spaloven</li>
                                <li>Zoom ≥ 12: Detailní pohled s polygony areálů a budov</li>
                                <li>Dynamické přepínání mezi režimy zobrazení</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                🔧 Optimalizace výkonu
                            </h3>
                            <ul className="text-gray-600 space-y-1 text-sm list-disc pl-5">
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
