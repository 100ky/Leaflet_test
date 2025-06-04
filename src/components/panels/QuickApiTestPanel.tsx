/**
 * Komponenta pro rychlé testování a porovnání API zdrojů
 */

'use client';

import { useState, Fragment } from 'react'; // Přidán Fragment
import { fetchRemoteIncinerators, testRemoteApiConnection } from '@/services/remoteApi';
import { fetchIncineratorsWithCache } from '@/services/incineratorApi';
import { logger } from '@/utils/logger';
import { getApiSourceIcon, getApiSourceName } from '@/utils/statusHelpers';
import { Panel } from '../ui/Panel';
import { TestResultItem } from '../ui/TestResultItem';
import { InfoBlock } from '../ui/InfoBlock';

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
    const [connectionTestResult, setConnectionTestResult] = useState<{
        success: boolean;
        timestamp: Date;
    } | null>(null);

    const testBothApis = async () => {
        setTesting(true);
        setConnectionTestResult(null); // Reset connection test result
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
        setResults([]); // Reset API comparison results
        try {
            const success = await testRemoteApiConnection();
            logger.api(`Connection test result: ${success}`);
            setConnectionTestResult({ success, timestamp: new Date() });
        } catch (error) {
            logger.error('Connection test failed:', error);
            setConnectionTestResult({ success: false, timestamp: new Date() });
        } finally {
            setTesting(false);
        }
    };

    return (
        <Panel
            title={
                <>
                    ⚡ <span className="responsive-inline">Rychlé testování API</span>
                    <span className="hidden-desktop">API Test</span>
                </>
            }
            isCollapsible={true}
            initiallyExpanded={false}
        >
            <div className="section-spacing">
                {/* Test buttons */}
                <div className="button-group">
                    <button
                        onClick={testBothApis}
                        disabled={testing}
                        className="btn-base btn-blue"
                    >
                        {testing && results.length > 0 ? '🔄' : '🚀'} {/* Změna ikony pokud testuje API */}
                        <span className="ml-1">
                            <span className="hidden sm:inline">
                                {testing && results.length > 0 ? 'Testuje API...' : 'Test obou API'}
                            </span>
                            <span className="sm:hidden">
                                {testing && results.length > 0 ? 'Test API...' : 'Test API'}
                            </span>
                        </span>
                    </button>
                    <button
                        onClick={testConnectionOnly}
                        disabled={testing}
                        className="btn-base btn-green"
                    >
                        {testing && connectionTestResult ? '🔄' : '🔗'} {/* Změna ikony pokud testuje připojení */}
                        <span className="ml-1">
                            <span className="hidden sm:inline">
                                {testing && connectionTestResult ? 'Testuje připojení...' : 'Test připojení'}
                            </span>
                            <span className="sm:hidden">
                                {testing && connectionTestResult ? 'Testuje...' : 'Připojení'}
                            </span>
                        </span>
                    </button>
                </div>

                {/* Connection Test Result */}
                {connectionTestResult && (
                    <TestResultItem
                        title="Test připojení k vzdálenému API"
                        status={connectionTestResult.success ? 'success' : 'error'}
                        timestamp={connectionTestResult.timestamp}
                        details={connectionTestResult.success ? 'Připojení úspěšné.' : 'Připojení selhalo.'}
                        className="my-4"
                    />
                )}

                {/* API Comparison Results */}
                {results.length > 0 && (
                    <div className="section-spacing-sm">
                        <h4 className="text-label text-gray-700 mb-2">
                            <span className="hidden-mobile">Výsledky testu API:</span>
                            <span className="hidden-desktop">Výsledky API:</span>
                        </h4>
                        <div className="space-y-3">
                            {results.map((result) => (
                                <TestResultItem
                                    key={result.source}
                                    title={getApiSourceName(result.source)}
                                    status={result.success ? 'success' : 'error'}
                                    timestamp={result.timestamp}
                                    icon={getApiSourceIcon(result.source)}
                                    details={
                                        result.success ? (
                                            <dl>
                                                <InfoBlock label="Počet záznamů:" value={result.count} />
                                                <InfoBlock label="Rychlost načítání:" value={`${result.loadTime}ms`} />
                                            </dl>
                                        ) : (
                                            <strong>Chyba: {result.error}</strong>
                                        )
                                    }
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Comparison Summary */}
                {results.length === 2 && results.every(r => r.success) && (
                    <div className="info-box mt-4">
                        <h4 className="text-label font-medium text-blue-800 mb-2">Porovnání úspěšných testů:</h4>
                        <InfoBlock
                            label="Počet dat (Lokální vs Vzdálené):"
                            value={`${results.find(r => r.source === 'local')?.count} vs ${results.find(r => r.source === 'remote')?.count}`}
                            className="text-responsive info-text"
                        />
                        <InfoBlock
                            label="Rychlost (Lokální vs Vzdálené):"
                            value={`${results.find(r => r.source === 'local')?.loadTime}ms vs ${results.find(r => r.source === 'remote')?.loadTime}ms`}
                            className="text-responsive info-text"
                        />
                    </div>
                )}

                {/* Info */}
                <div className="info-text hidden-mobile">
                    💡 <strong>Tip:</strong> Tento test načte všechna dostupná data z obou zdrojů pro porovnání rychlosti a počtu záznamů.
                </div>
            </div>
        </Panel>
    );
};
