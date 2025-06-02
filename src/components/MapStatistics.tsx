/**
 * Komponenta pro zobrazení statistik a metrik mapové aplikace
 */

'use client';

import { useState, useEffect } from 'react';

interface PerformanceMetrics {
    apiCalls: number;
    cacheHits: number;
    cacheMisses: number;
    averageResponseTime: number;
    totalDataLoaded: number;
    lastUpdate: Date;
    viewportChanges: number;
    loadingTime: number;
    currentRegion: string;
}

interface MapStatisticsProps {
    incineratorsCount: number;
    loading: boolean;
    error: string | null;
    totalCount: number;
    clustered: boolean;
    region?: string; // Nový prop pro zobrazení regionu
    loadingTime?: number; // Aktuální loading čas
}

export const MapStatistics: React.FC<MapStatisticsProps> = ({
    incineratorsCount,
    loading,
    error,
    totalCount,
    clustered,
    region = 'Neznámá oblast',
    loadingTime: propLoadingTime = 0
}) => {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        apiCalls: 0,
        cacheHits: 0,
        cacheMisses: 0,
        averageResponseTime: 1000, // Odpovídá regionálnímu API_DELAY
        totalDataLoaded: 0,
        lastUpdate: new Date(),
        viewportChanges: 0,
        loadingTime: 0,
        currentRegion: 'Neznámá oblast'
    });

    const [expanded, setExpanded] = useState(true); // Rozbaleno defaultně pro lepší UX
    const [loadingStartTime, setLoadingStartTime] = useState<Date | null>(null);

    // Sledování loading stavu pro měření času
    useEffect(() => {
        if (loading && !loadingStartTime) {
            setLoadingStartTime(new Date());
        } else if (!loading && loadingStartTime) {
            const loadTime = propLoadingTime || (Date.now() - loadingStartTime.getTime());
            setMetrics(prev => ({
                ...prev,
                apiCalls: prev.apiCalls + 1,
                loadingTime: loadTime,
                lastUpdate: new Date(),
                currentRegion: region
            }));
            setLoadingStartTime(null);
        }
    }, [loading, loadingStartTime, propLoadingTime, region]);

    // Sledování změn počtu spaloven (nový viewport)
    useEffect(() => {
        if (incineratorsCount !== metrics.totalDataLoaded) {
            setMetrics(prev => ({
                ...prev,
                totalDataLoaded: incineratorsCount,
                viewportChanges: prev.viewportChanges + 1,
                lastUpdate: new Date(),
                currentRegion: region
            }));
        }
    }, [incineratorsCount, metrics.totalDataLoaded, region]);

    const cacheHitRate = metrics.cacheHits + metrics.cacheMisses > 0
        ? (metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses) * 100).toFixed(1)
        : '0';

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 flex items-center">
                        📊 Statistiky mapy - Dynamické načítání
                    </h3>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : error ? 'bg-red-400' : 'bg-green-400'}`}></div>
                            <span className="text-sm text-gray-600">
                                {loading ? 'Načítám data...' : error ? 'Chyba' : 'Data načtena'}
                            </span>
                        </div>
                        <span className="text-gray-400">
                            {expanded ? '▼' : '▶'}
                        </span>
                    </div>
                </div>

                <div className="mt-2 grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{incineratorsCount}</div>
                        <div className="text-xs text-gray-500">Zobrazené</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{totalCount}</div>
                        <div className="text-xs text-gray-500">V oblasti</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{metrics.apiCalls}</div>
                        <div className="text-xs text-gray-500">API volání</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{metrics.viewportChanges}</div>
                        <div className="text-xs text-gray-500">Změny pohledu</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{metrics.loadingTime}ms</div>
                        <div className="text-xs text-gray-500">Poslední načtení</div>
                    </div>
                </div>
            </div>

            {expanded && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">🔄 Dynamické načítání</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Aktuální region:</span>
                                    <span className="font-mono text-indigo-600">{metrics.currentRegion}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Celkem API volání:</span>
                                    <span className="font-mono text-blue-600">{metrics.apiCalls}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Změny viewport:</span>
                                    <span className="font-mono text-purple-600">{metrics.viewportChanges}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Doba načítání:</span>
                                    <span className="font-mono text-orange-600">{metrics.loadingTime}ms</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Úspěšnost cache:</span>
                                    <span className="font-mono text-teal-600">{cacheHitRate}%</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">📊 Stav dat</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Zobrazené spalovny:</span>
                                    <span className="font-mono text-blue-600">{incineratorsCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Spalovny v oblasti:</span>
                                    <span className="font-mono text-green-600">{totalCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Clustering:</span>
                                    <span className={`font-mono ${clustered ? 'text-blue-600' : 'text-gray-400'}`}>
                                        {clustered ? 'Aktivní' : 'Neaktivní'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Poslední aktualizace:</span>
                                    <span className="font-mono text-xs">
                                        {metrics.lastUpdate.toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                            <div className="text-sm text-red-700">
                                <strong>Chyba:</strong> {error}
                            </div>
                        </div>
                    )}

                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                        <div className="text-xs text-blue-700">
                            💡 <strong>Jak to funguje:</strong> Data se načítají dynamicky podle aktuálního pohledu na mapu.
                            Při posunutí nebo změně zoomu se automaticky stahují pouze spalovny v aktuální oblasti.
                            Různé regiony mají různé loading časy a množství dat. Praha má nejvíce dat, venkovské oblasti méně.
                        </div>
                    </div>

                    <div className="mt-2 text-xs text-gray-500 text-center">
                        📈 Statistiky se aktualizují v reálném čase podle aktivit na mapě • Region: {metrics.currentRegion}
                    </div>
                </div>
            )}        </div>
    );
};

export default MapStatistics;
