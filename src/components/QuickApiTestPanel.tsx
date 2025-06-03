/**
 * Komponenta pro rychlé testování a porovnání API zdrojů
 */

'use client';

import { useState } from 'react';
import { fetchRemoteIncinerators, testRemoteApiConnection } from '@/services/remoteApi';
import { fetchIncineratorsWithCache } from '@/services/incineratorApi';
import { logger } from '@/utils/logger';
import { getApiSourceIcon, getApiSourceName } from '@/utils/statusHelpers';

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
            logger.api(`Connection test result: ${connected}`);
        } catch (error) {
            logger.error('Connection test failed:', error);
        } finally {
            setTesting(false);
        }
    };

    return (<div className="panel-base">
        <div
            className="panel-content clickable-area"
            onClick={() => setExpanded(!expanded)}
        >
            <div className="flex-header">
                <h3 className="panel-title flex items-center">
                    ⚡ <span className="responsive-inline">Rychlé testování API</span>
                    <span className="hidden-desktop">API Test</span>
                </h3>
                <span className="text-gray-400">
                    {expanded ? '▼' : '▶'}
                </span>
            </div>
        </div>
        {expanded && (
            <div className="border-t border-gray-200 panel-content bg-gray-50">
                <div className="section-spacing">
                    {/* Test buttons */}
                    <div className="button-group">
                        <button
                            onClick={testBothApis}
                            disabled={testing}
                            className="btn-base btn-blue"
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
                            className="btn-base btn-green"
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
                        <div className="section-spacing-sm">
                            <h4 className="text-label text-gray-700">
                                <span className="hidden-mobile">Výsledky posledního testu:</span>
                                <span className="hidden-desktop">Výsledky:</span>
                            </h4>
                            {results.map((result, index) => (
                                <div
                                    key={index}
                                    className={`result-card ${result.success
                                        ? 'success-card'
                                        : 'error-card'
                                        }`}
                                >
                                    <div className="flex-header">
                                        <div className="flex items-center gap-2">
                                            <span>{getApiSourceIcon(result.source)}</span>
                                            <span className="text-label font-medium">
                                                <span className="hidden-mobile">
                                                    {getApiSourceName(result.source)}
                                                </span>
                                                <span className="hidden-desktop">
                                                    {result.source === 'remote' ? 'Remote' : 'Local'}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="text-helper hidden-mobile">
                                            {result.timestamp.toLocaleTimeString('cs-CZ')}
                                        </div>
                                    </div>

                                    {result.success ? (
                                        <div className="detail-list">
                                            <div className="detail-item">
                                                <span>
                                                    <span className="hidden-mobile">Počet záznamů:</span>
                                                    <span className="hidden-desktop">Počet:</span>
                                                </span>
                                                <span className="font-medium">{result.count}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span>
                                                    <span className="hidden-mobile">Rychlost načítání:</span>
                                                    <span className="hidden-desktop">Čas:</span>
                                                </span>
                                                <span className="font-medium">{result.loadTime}ms</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-label text-red-700">
                                            <strong>Chyba:</strong> {result.error}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Comparison */}
                    {results.length === 2 && results.every(r => r.success) && (
                        <div className="info-box">
                            <h4 className="text-label font-medium text-blue-800 mb-2">Porovnání:</h4>
                            <div className="text-responsive info-text">
                                <div>
                                    📊 <strong>
                                        <span className="hidden-mobile">Počet dat:</span>
                                        <span className="hidden-desktop">Data:</span>
                                    </strong> Lokální {results.find(r => r.source === 'local')?.count} vs Vzdálené {results.find(r => r.source === 'remote')?.count}
                                </div>
                                <div>
                                    ⚡ <strong>Rychlost:</strong> Lokální {results.find(r => r.source === 'local')?.loadTime}ms vs Vzdálené {results.find(r => r.source === 'remote')?.loadTime}ms
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info */}
                    <div className="info-text hidden-mobile">
                        💡 <strong>Tip:</strong> Tento test načte všechna dostupná data z obou zdrojů pro porovnání rychlosti a počtu záznamů.
                    </div>
                </div>
            </div>
        )}
    </div>
    );
};
