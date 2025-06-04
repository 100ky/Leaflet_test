/**
 * Komponenta pro zobrazení detailních informací o načtených datech
 */

'use client';

import { useEffect, useState } from 'react';
import { Incinerator } from '@/types';
import { getDataSourceIcon, getDataSourceText, type ApiStatusState } from '@/utils/statusHelpers';

interface DataInfoPanelProps {
    incinerators: Incinerator[];
    loading: boolean;
    error: string | null;
    usingRemoteApi: boolean;
    currentRegion: string;
}

export const DataInfoPanel: React.FC<DataInfoPanelProps> = ({
    incinerators,
    loading,
    error,
    usingRemoteApi,
    currentRegion
}) => {
    const [dataStats, setDataStats] = useState({
        total: 0,
        operational: 0,
        nonOperational: 0,
        withAddress: 0,
        withCapacity: 0,
        avgYear: 0,
        regionBreakdown: {} as Record<string, number>
    });

    useEffect(() => {
        if (incinerators.length > 0) {
            const stats = {
                total: incinerators.length,
                operational: incinerators.filter(i => i.operational).length,
                nonOperational: incinerators.filter(i => !i.operational).length,
                withAddress: incinerators.filter(i => i.streetAddress).length,
                withCapacity: incinerators.filter(i => i.capacity).length,
                avgYear: 0,
                regionBreakdown: {} as Record<string, number>
            };

            // Průměrný rok
            const yearsData = incinerators
                .filter(i => i.yearEstablished)
                .map(i => i.yearEstablished!);

            if (yearsData.length > 0) {
                stats.avgYear = Math.round(yearsData.reduce((sum, year) => sum + year, 0) / yearsData.length);
            }

            setDataStats(stats);
        } else {
            setDataStats({
                total: 0,
                operational: 0,
                nonOperational: 0,
                withAddress: 0,
                withCapacity: 0,
                avgYear: 0,
                regionBreakdown: {}
            });
        }
    }, [incinerators]);

    const apiState: ApiStatusState = { loading, error, usingRemoteApi };

    const completenessPercentage = dataStats.total > 0 ?
        Math.round((dataStats.withAddress / dataStats.total) * 100) : 0;

    return (
        <div className="panel-base data-analysis-panel">
            <div className="flex-header mb-3 sm:mb-4" style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', zIndex: 1 }}>
                <h3 className="panel-title flex items-center">
                    <span className="mr-2">{getDataSourceIcon(apiState)}</span>
                    <span className="responsive-inline">Analýza dat</span>
                    <span className="hidden-desktop">Data</span>
                </h3>
                <div className="text-responsive text-gray-700">
                    <span className="hidden-mobile">{getDataSourceText(apiState)}</span>
                    <span className="hidden-desktop">{getDataSourceIcon(apiState)}</span>
                </div>
            </div>

            <div className="data-content-container">
                {loading && (
                    <div className="loading-center">
                        <div className="loading-spinner"></div>
                        <span className="loading-text">
                            <span className="hidden-mobile">Načítání dat...</span>
                            <span className="hidden-desktop">Načítá...</span>
                        </span>
                    </div>
                )}

                {error && (
                    <div className="error-box">
                        <div className="text-label text-red-800">
                            <strong>Chyba:</strong> {error}
                        </div>
                    </div>
                )}

                {!loading && !error && (
                    <div className="section-spacing">
                        {/* Základní statistiky */}
                        <div className="stats-grid">
                            <div className="stat-card text-center">
                                <div className="stat-value text-blue-700">{dataStats.total}</div>
                                <div className="stat-label text-blue-600">
                                    <span className="hidden-mobile">Celkem spaloven</span>
                                    <span className="hidden-desktop">Celkem</span>
                                </div>
                            </div>
                            <div className="stat-card text-center">
                                <div className="stat-value text-green-700">{dataStats.operational}</div>
                                <div className="stat-label text-green-600">V provozu</div>
                            </div>
                        </div>

                        {/* Aktuální region */}
                        <div className="info-box">
                            <div className="text-label text-gray-700">Aktuální oblast:</div>
                            <div className="text-responsive font-medium text-gray-800">{currentRegion}</div>
                        </div>

                        {/* Detailní informace */}
                        {dataStats.total > 0 && (
                            <div className="detail-list">
                                <div className="detail-item">
                                    <span className="text-gray-700">Mimo provoz:</span>
                                    <span className="font-medium">{dataStats.nonOperational}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="text-gray-700">
                                        <span className="hidden-mobile">S adresou:</span>
                                        <span className="hidden-desktop">Adresy:</span>
                                    </span>
                                    <span className="font-medium">{dataStats.withAddress} ({completenessPercentage}%)</span>
                                </div>
                                <div className="detail-item">
                                    <span className="text-gray-700">
                                        <span className="hidden-mobile">S kapacitou:</span>
                                        <span className="hidden-desktop">Kapacity:</span>
                                    </span>
                                    <span className="font-medium">{dataStats.withCapacity}</span>
                                </div>
                                {dataStats.avgYear > 0 && (
                                    <div className="detail-item">
                                        <span className="text-gray-700">
                                            <span className="hidden-mobile">Průměrný rok:</span>
                                            <span className="hidden-desktop">Rok:</span>
                                        </span>
                                        <span className="font-medium">{dataStats.avgYear}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Progress bar pro úplnost dat */}
                        {dataStats.total > 0 && (
                            <div className="progress-section">
                                <div className="progress-header">
                                    <span>Úplnost dat</span>
                                    <span>{completenessPercentage}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill bg-blue-600"
                                        style={{ width: `${completenessPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Data source info */}
                        <div className="info-text hidden-mobile">
                            {usingRemoteApi ? (
                                <>
                                    <div><strong>🌐 Vzdálené API:</strong> Live data z combustion.radek18.com</div>
                                    <div>Zobrazuje skutečná data spaloven v České republice</div>
                                </>
                            ) : (
                                <>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};