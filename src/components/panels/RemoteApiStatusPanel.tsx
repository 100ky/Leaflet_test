/**
 * Komponenta pro zobrazení stavu vzdáleného API a možností přepínání
 */

'use client';

import { useState } from 'react';
import { testRemoteApiConnection } from '@/services/remoteApi';
import {
    getApiStatusIcon,
    getApiStatusText,
    getApiStatusColor,
    getButtonLoadingIcon,
    getButtonLoadingText,
    type ApiStatusState
} from '@/utils/statusHelpers';
import { Panel } from '../ui/Panel';
import { TestResultItem } from '../ui/TestResultItem';

interface RemoteApiStatusPanelProps {
    usingRemoteApi: boolean;
    loading: boolean;
    error: string | null;
    onSwitchToRemote: () => void;
    onSwitchToLocal: () => void;
}

export const RemoteApiStatusPanel: React.FC<RemoteApiStatusPanelProps> = ({
    usingRemoteApi,
    loading,
    error,
    onSwitchToRemote,
    onSwitchToLocal
}) => {
    const [testingConnection, setTestingConnection] = useState(false);
    const [lastTestResult, setLastTestResult] = useState<{
        success: boolean;
        timestamp: Date;
        duration: number;
    } | null>(null);

    const testConnection = async () => {
        setTestingConnection(true);
        const startTime = Date.now();

        try {
            const success = await testRemoteApiConnection();
            const duration = Date.now() - startTime;

            setLastTestResult({
                success,
                timestamp: new Date(),
                duration
            });
        } catch {
            const duration = Date.now() - startTime;
            setLastTestResult({
                success: false,
                timestamp: new Date(),
                duration
            });
        } finally {
            setTestingConnection(false);
        }
    };

    const apiState: ApiStatusState = { loading, error, usingRemoteApi };

    const panelTitle = (
        <>
            <span className="mr-2">{getApiStatusIcon(apiState)}</span>
            <span className="hidden-mobile">API Status Panel</span>
            <span className="hidden-desktop">API Status</span>
        </>
    );

    const panelHeaderContent = (
        <div className={`text-responsive font-medium ${getApiStatusColor(apiState)}`}>
            <span className="hidden-mobile">{getApiStatusText(apiState)}</span>
            <span className="hidden-desktop">{getApiStatusIcon(apiState)}</span>
        </div>
    );

    return (
        <Panel
            title={panelTitle}
            headerContent={panelHeaderContent}
            className="panel-main"
            isCollapsible={false}
        >
            {/* Aktuální stav */}
            <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
                <div className="text-label mb-2">Aktuální konfigurace:</div>
                <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                        {usingRemoteApi ? '🌐 Vzdálené API' : '🏠 Lokální API'}
                    </span>
                    <span className="text-xs text-gray-700 hidden sm:inline">
                        {usingRemoteApi ? 'https://combustion.radek18.com' : 'Local simulation'}
                    </span>
                </div>
            </div>

            {/* Error display */}
            {error && (
                <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-xs sm:text-sm text-red-800">
                        <strong>Chyba:</strong> {error}
                    </div>
                </div>
            )}

            {/* Connection test */}
            <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-blue-800">
                        <span className="hidden sm:inline">Test připojení k API</span>
                        <span className="sm:hidden">Test API</span>
                    </span>
                    <button
                        onClick={testConnection}
                        disabled={testingConnection}
                        className="px-2 sm:px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 transition-colors"
                    >
                        {getButtonLoadingIcon(testingConnection)}
                        <span className="hidden sm:inline ml-1">
                            {getButtonLoadingText(testingConnection, 'Testovat')}
                        </span>
                        <span className="sm:hidden ml-1">
                            {getButtonLoadingText(testingConnection, 'Test')}
                        </span>
                    </button>
                </div>

                {lastTestResult && (
                    <TestResultItem
                        title="Výsledek testu"
                        status={lastTestResult.success ? 'success' : 'error'}
                        timestamp={lastTestResult.timestamp}
                        details={<>Trvání: {lastTestResult.duration}ms</>}
                        className="mt-2" // Přidána třída pro odsazení
                    />
                )}
            </div>

            {/* API Switch buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                    onClick={onSwitchToLocal}
                    disabled={loading || !usingRemoteApi}
                    className="px-2 sm:px-3 py-2 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    🏠 Lokální API
                </button>
                <button
                    onClick={onSwitchToRemote}
                    disabled={loading || usingRemoteApi}
                    className="px-2 sm:px-3 py-2 text-xs sm:text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    🌐 Vzdálené API
                </button>
            </div>

            {/* API Info */}
            <div className="mt-3 sm:mt-4 text-xs text-gray-700 space-y-1 hidden sm:block">
                <div><strong>Lokální API:</strong> Simulovaná data s regionálními loading charakteristikami</div>
                <div><strong>Vzdálené API:</strong> Skutečná data ze serveru combustion.radek18.com</div>
            </div>
        </Panel>
    );
};
