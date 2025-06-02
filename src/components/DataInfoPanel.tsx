/**
 * Komponenta pro zobrazení detailních informací o načtených datech
 */

'use client';

import { useEffect, useState } from 'react';
import { Incinerator } from '@/types';

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

    const getDataSourceIcon = () => {
        if (loading) return '⏳';
        if (error) return '❌';
        return usingRemoteApi ? '🌐' : '🏠';
    };

    const getDataSourceText = () => {
        if (loading) return 'Načítání...';
        if (error) return 'Chyba dat';
        return usingRemoteApi ? 'Vzdálená data' : 'Lokální data';
    };

    const completenessPercentage = dataStats.total > 0 ?
        Math.round((dataStats.withAddress / dataStats.total) * 100) : 0;

    return (<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center text-sm sm:text-base">
                <span className="mr-2">{getDataSourceIcon()}</span>
                <span className="hidden sm:inline">Analýza dat</span>
                <span className="sm:hidden">Data</span>
            </h3>
            <div className="text-xs sm:text-sm text-gray-500">
                <span className="hidden sm:inline">{getDataSourceText()}</span>
                <span className="sm:hidden">{getDataSourceIcon()}</span>
            </div>
        </div>            {loading && (
            <div className="flex items-center justify-center py-6 sm:py-8">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-600">
                    <span className="hidden sm:inline">Načítání dat...</span>
                    <span className="sm:hidden">Načítá...</span>
                </span>
            </div>
        )}

        {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                <div className="text-xs sm:text-sm text-red-800">
                    <strong>Chyba:</strong> {error}
                </div>
            </div>
        )}

        {!loading && !error && (
            <div className="space-y-3 sm:space-y-4">
                {/* Základní statistiky */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg sm:text-2xl font-bold text-blue-700">{dataStats.total}</div>
                        <div className="text-xs sm:text-sm text-blue-600">
                            <span className="hidden sm:inline">Celkem spaloven</span>
                            <span className="sm:hidden">Celkem</span>
                        </div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
                        <div className="text-lg sm:text-2xl font-bold text-green-700">{dataStats.operational}</div>
                        <div className="text-xs sm:text-sm text-green-600">V provozu</div>
                    </div>
                </div>

                {/* Aktuální region */}
                <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Aktuální oblast:</div>
                    <div className="font-medium text-gray-800 text-sm sm:text-base">{currentRegion}</div>
                </div>

                {/* Detailní informace */}
                {dataStats.total > 0 && (
                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Mimo provoz:</span>
                            <span className="font-medium">{dataStats.nonOperational}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                <span className="hidden sm:inline">S adresou:</span>
                                <span className="sm:hidden">Adresy:</span>
                            </span>
                            <span className="font-medium">{dataStats.withAddress} ({completenessPercentage}%)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                <span className="hidden sm:inline">S kapacitou:</span>
                                <span className="sm:hidden">Kapacity:</span>
                            </span>
                            <span className="font-medium">{dataStats.withCapacity}</span>
                        </div>
                        {dataStats.avgYear > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    <span className="hidden sm:inline">Průměrný rok:</span>
                                    <span className="sm:hidden">Rok:</span>
                                </span>
                                <span className="font-medium">{dataStats.avgYear}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Progress bar pro úplnost dat */}
                {dataStats.total > 0 && (
                    <div className="mt-3 sm:mt-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Úplnost dat</span>
                            <span>{completenessPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${completenessPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Data source info */}
                <div className="mt-3 sm:mt-4 text-xs text-gray-500 space-y-1 hidden sm:block">
                    {usingRemoteApi ? (
                        <>
                            <div><strong>🌐 Vzdálené API:</strong> Live data z combustion.radek18.com</div>
                            <div>Zobrazuje skutečná data spaloven v České republice</div>
                        </>
                    ) : (
                        <>
                            <div><strong>🏠 Lokální API:</strong> Simulovaná data s regionální logikou</div>
                            <div>Obsahuje rozšířené informace včetně geometrie budov</div>
                        </>
                    )}
                </div>
            </div>
        )}
    </div>
    );
};
