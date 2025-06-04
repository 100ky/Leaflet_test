/**
 * MapStatistics - Komponenta pro zobrazení statistik mapy
 * Zobrazuje počet spaloven, region, clustering status a další užitečné informace
 */

'use client';

import { useState } from 'react';
import { getExpandIcon, getLoadingStateClass, getLoadingStateText } from '@/utils/statusHelpers';

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
        <div className="panel-base">
            {/* Header s toggle funkcionalitou */}
            <div
                className="panel-content clickable-area"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex-header">
                    <h3 className="panel-title flex items-center">
                        📊 <span className="responsive-inline">Statistiky mapy</span>
                        <span className="hidden-desktop">Stats</span>
                    </h3>
                    <div className="flex-status">
                        {/* Status indikátor */}
                        <div className="flex-status">
                            <div className={`status-dot ${getLoadingStateClass(loading, error)}`}></div>
                            <span className="text-responsive text-gray-700">
                                {getLoadingStateText(loading, error)}
                            </span>
                        </div>
                        <span className="text-helper text-gray-700">
                            {getExpandIcon(expanded)}
                        </span>
                    </div>
                </div>

                {/* Rychlé statistiky */}
                <div className="stats-grid mt-2">
                    <div className="stat-card text-center">
                        <div className="stat-value text-blue-600">{incineratorsCount}</div>
                        <div className="text-helper text-gray-700">Zobrazené</div>
                    </div>
                    <div className="stat-card text-center">
                        <div className="stat-value text-green-600">{totalCount}</div>
                        <div className="text-helper text-gray-700">V oblasti</div>
                    </div>
                    <div className="stat-card text-center">
                        <div className="text-responsive font-medium text-purple-600 break-words">{region}</div>
                        <div className="text-helper text-gray-700">Region</div>
                    </div>
                    <div className="stat-card text-center">
                        <div className="text-responsive font-medium text-orange-600">
                            {clustered ? 'Aktivní' : 'Neaktivní'}
                        </div>
                        <div className="text-helper text-gray-700">Clustering</div>
                    </div>
                </div>
            </div>

            {/* Rozšířené detaily */}
            {expanded && (
                <div className="panel-content border-t bg-gray-50">
                    <div className="section-spacing-sm text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-700">Aktuální region:</span>
                            <span className="font-mono text-indigo-600">{region}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-700">Zobrazené spalovny:</span>
                            <span className="font-mono text-blue-600">{incineratorsCount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-700">Spalovny v oblasti:</span>
                            <span className="font-mono text-green-600">{totalCount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-700">Clustering:</span>
                            <span className={`font-mono ${clustered ? 'text-blue-600' : 'text-gray-600'}`}>
                                {clustered ? 'Aktivní' : 'Neaktivní'}
                            </span>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="warning-box mt-4">
                            <div className="text-sm text-red-700">
                                <strong>Chyba:</strong> {error}
                            </div>
                        </div>
                    )}

                    {/* Info box */}
                    <div className="info-box mt-4">
                        <div className="text-label text-blue-700">
                            💡 <strong>Info:</strong> Data se načítají dynamicky podle aktuálního pohledu na mapu.
                            Různé regiony mají různé loading časy a množství dat.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export { MapStatistics };
export default MapStatistics;
