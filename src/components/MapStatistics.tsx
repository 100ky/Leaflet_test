/**
 * MapStatistics - Komponenta pro zobrazení statistik mapy
 * Zobrazuje počet spaloven, region, clustering status a další užitečné informace
 */

'use client';

import { useState } from 'react';

/**
 * Props pro komponentu MapStatistics
 */
interface MapStatisticsProps {
    /** Počet zobrazených spaloven */
    incineratorsCount: number;
    /** Stav načítání dat */
    loading: boolean;
    /** Chybová zpráva */
    error: string | null;
    /** Celkový počet spaloven v oblasti */
    totalCount: number;
    /** Stav clusteringu */
    clustered: boolean;
    /** Název regionu */
    region?: string;
    /** Čas načítání v ms */
    loadingTime?: number;
}

/**
 * Komponenta pro zobrazení statistik mapy
 */

const MapStatistics: React.FC<MapStatisticsProps> = ({
    incineratorsCount,
    loading,
    error,
    totalCount,
    clustered,
    region = 'Neznámá oblast'
}) => {
    const [expanded, setExpanded] = useState(true); return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Header s toggle funkcionalitou */}
            <div
                className="p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 flex items-center text-sm sm:text-base">
                        📊 <span className="hidden sm:inline">Statistiky mapy</span>
                        <span className="sm:hidden">Stats</span>
                    </h3>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Status indikátor */}
                        <div className="flex items-center space-x-1 sm:space-x-2">
                            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : error ? 'bg-red-400' : 'bg-green-400'}`}></div>
                            <span className="text-xs sm:text-sm text-gray-600">
                                {loading ? 'Načítám...' : error ? 'Chyba' : 'OK'}
                            </span>
                        </div>
                        <span className="text-gray-400 text-sm sm:text-base">
                            {expanded ? '▼' : '▶'}
                        </span>
                    </div>
                </div>

                {/* Rychlé statistiky */}
                <div className="mt-2 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">                    <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-blue-600">{incineratorsCount}</div>
                    <div className="text-xs text-gray-500">Zobrazené</div>
                </div>
                    <div className="text-center">
                        <div className="text-lg sm:text-2xl font-bold text-green-600">{totalCount}</div>
                        <div className="text-xs text-gray-500">V oblasti</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs sm:text-sm font-medium text-purple-600 break-words">{region}</div>
                        <div className="text-xs text-gray-500">Region</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs sm:text-sm font-medium text-orange-600">
                            {clustered ? 'Aktivní' : 'Neaktivní'}
                        </div>
                        <div className="text-xs text-gray-500">Clustering</div>
                    </div>
                </div>
            </div>

            {/* Rozšířené detaily */}            {expanded && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Aktuální region:</span>
                            <span className="font-mono text-indigo-600">{region}</span>
                        </div>
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
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                            <div className="text-sm text-red-700">
                                <strong>Chyba:</strong> {error}
                            </div>
                        </div>
                    )}

                    {/* Info box */}
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                        <div className="text-xs text-blue-700">
                            💡 <strong>Info:</strong> Data se načítají dynamicky podle aktuálního pohledu na mapu.
                            Různé regiony mají různé loading časy a množství dat.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapStatistics;
