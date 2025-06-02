/**
 * Komponenta pro rychlé testování a porovnání API zdrojů
 */

'use client';

import { useState } from 'react';
import { fetchRemoteIncinerators, testRemoteApiConnection } from '@/services/remoteApi';
import { fetchIncineratorsWithCache } from '@/services/incineratorApi';

interface ApiComparisonResult {
    source: 'local' | 'remote';
    count: number;
    loadTime: number;
    success: boolean;
    error?: string;
    timestamp: Date;
}

export const QuickApiTestPanel: React.FC = () => {
    const [testing, setTesting] = useState(false);
    const [results, setResults] = useState<ApiComparisonResult[]>([]);
    const [expanded, setExpanded] = useState(false);

    const testBothApis = async () => {
        setTesting(true);
        const newResults: ApiComparisonResult[] = [];

        // Test lokálního API
        try {
            const localStart = Date.now();
            const localResponse = await fetchIncineratorsWithCache({
                bounds: { north: 51, south: 48, east: 19, west: 12 },
                zoom: 7,
                clustered: false
            });
            const localTime = Date.now() - localStart;

            newResults.push({
                source: 'local',
                count: localResponse.incinerators.length,
                loadTime: localTime,
                success: true,
                timestamp: new Date()
            });
        } catch (error) {
            newResults.push({
                source: 'local',
                count: 0,
                loadTime: 0,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date()
            });
        }

        // Test vzdáleného API
        try {
            const remoteStart = Date.now();
            const remoteData = await fetchRemoteIncinerators();
            const remoteTime = Date.now() - remoteStart;

            newResults.push({
                source: 'remote',
                count: remoteData.length,
                loadTime: remoteTime,
                success: true,
                timestamp: new Date()
            });
        } catch (error) {
            newResults.push({
                source: 'remote',
                count: 0,
                loadTime: 0,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date()
            });
        }

        setResults(newResults);
        setTesting(false);
    };

    const testConnectionOnly = async () => {
        setTesting(true);
        try {
            const connected = await testRemoteApiConnection();
            console.log(`Connection test result: ${connected}`);
        } catch (error) {
            console.error('Connection test failed:', error);
        } finally {
            setTesting(false);
        }
    };

    const getSourceIcon = (source: 'local' | 'remote') => {
        return source === 'remote' ? '🌐' : '🏠';
    };

    const getSourceName = (source: 'local' | 'remote') => {
        return source === 'remote' ? 'Vzdálené API' : 'Lokální API';
    };

    return (<div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div
            className="p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setExpanded(!expanded)}
        >
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 flex items-center text-sm sm:text-base">
                    ⚡ <span className="hidden sm:inline">Rychlé testování API</span>
                    <span className="sm:hidden">API Test</span>
                </h3>
                <span className="text-gray-400">
                    {expanded ? '▼' : '▶'}
                </span>
            </div>
        </div>            {expanded && (
            <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50">
                <div className="space-y-3 sm:space-y-4">
                    {/* Test buttons */}
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                            onClick={testBothApis}
                            disabled={testing}
                            className="px-3 py-2 text-xs sm:text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 transition-colors"
                        >
                            {testing ? '🔄' : '🚀'}
                            <span className="ml-1">
                                <span className="hidden sm:inline">
                                    {testing ? 'Testuje...' : 'Test obou API'}
                                </span>
                                <span className="sm:hidden">
                                    {testing ? 'Test...' : 'Test API'}
                                </span>
                            </span>
                        </button>
                        <button
                            onClick={testConnectionOnly}
                            disabled={testing}
                            className="px-3 py-2 text-xs sm:text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50 transition-colors"
                        >
                            {testing ? '🔄' : '🔗'}
                            <span className="ml-1">
                                <span className="hidden sm:inline">
                                    {testing ? 'Testuje...' : 'Test připojení'}
                                </span>
                                <span className="sm:hidden">
                                    {testing ? 'Test...' : 'Připojení'}
                                </span>
                            </span>
                        </button>
                    </div>

                    {/* Results */}
                    {results.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-xs sm:text-sm font-medium text-gray-700">
                                <span className="hidden sm:inline">Výsledky posledního testu:</span>
                                <span className="sm:hidden">Výsledky:</span>
                            </h4>
                            {results.map((result, index) => (
                                <div
                                    key={index}
                                    className={`p-2 sm:p-3 rounded-lg border ${result.success
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-red-50 border-red-200'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span>{getSourceIcon(result.source)}</span>
                                            <span className="font-medium text-xs sm:text-sm">
                                                <span className="hidden sm:inline">
                                                    {getSourceName(result.source)}
                                                </span>
                                                <span className="sm:hidden">
                                                    {result.source === 'remote' ? 'Remote' : 'Local'}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 hidden sm:block">
                                            {result.timestamp.toLocaleTimeString('cs-CZ')}
                                        </div>
                                    </div>

                                    {result.success ? (
                                        <div className="mt-1 sm:mt-2 text-xs sm:text-sm">
                                            <div className="flex justify-between">
                                                <span>
                                                    <span className="hidden sm:inline">Počet záznamů:</span>
                                                    <span className="sm:hidden">Počet:</span>
                                                </span>
                                                <span className="font-medium">{result.count}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>
                                                    <span className="hidden sm:inline">Rychlost načítání:</span>
                                                    <span className="sm:hidden">Čas:</span>
                                                </span>
                                                <span className="font-medium">{result.loadTime}ms</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-700">
                                            <strong>Chyba:</strong> {result.error}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Comparison */}
                    {results.length === 2 && results.every(r => r.success) && (
                        <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                            <h4 className="text-xs sm:text-sm font-medium text-blue-800 mb-1 sm:mb-2">Porovnání:</h4>
                            <div className="text-xs sm:text-sm space-y-1">
                                <div>
                                    📊 <strong>
                                        <span className="hidden sm:inline">Počet dat:</span>
                                        <span className="sm:hidden">Data:</span>
                                    </strong> Lokální {results.find(r => r.source === 'local')?.count} vs Vzdálené {results.find(r => r.source === 'remote')?.count}
                                </div>
                                <div>
                                    ⚡ <strong>Rychlost:</strong> Lokální {results.find(r => r.source === 'local')?.loadTime}ms vs Vzdálené {results.find(r => r.source === 'remote')?.loadTime}ms
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info */}
                    <div className="text-xs text-gray-500 hidden sm:block">
                        💡 <strong>Tip:</strong> Tento test načte všechna dostupná data z obou zdrojů pro porovnání rychlosti a počtu záznamů.
                    </div>
                </div>
            </div>
        )}
    </div>
    );
};
