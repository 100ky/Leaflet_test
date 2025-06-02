/**
 * Komponenta pro zobrazení stavu vzdáleného API a možností přepínání
 */

'use client';

import { useState } from 'react';
import { testRemoteApiConnection } from '@/services/remoteApi';

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

    const getStatusIcon = () => {
        if (loading) return '⏳';
        if (error) return '❌';
        if (usingRemoteApi) return '🌐';
        return '🏠';
    };

    const getStatusText = () => {
        if (loading) return 'Načítá...';
        if (error) return 'Chyba připojení';
        if (usingRemoteApi) return 'Vzdálené API aktivní';
        return 'Lokální API aktivní';
    };

    const getStatusColor = () => {
        if (loading) return 'text-blue-600';
        if (error) return 'text-red-600';
        if (usingRemoteApi) return 'text-green-600';
        return 'text-gray-600';
    };

    return (<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center text-sm sm:text-base">
                <span className="mr-2">{getStatusIcon()}</span>
                <span className="hidden sm:inline">API Status Panel</span>
                <span className="sm:hidden">API Status</span>
            </h3>
            <div className={`text-xs sm:text-sm font-medium ${getStatusColor()}`}>
                <span className="hidden sm:inline">{getStatusText()}</span>
                <span className="sm:hidden">{getStatusIcon()}</span>
            </div>
        </div>            {/* Aktuální stav */}
        <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
            <div className="text-xs sm:text-sm text-gray-600 mb-2">Aktuální konfigurace:</div>
            <div className="flex items-center justify-between">
                <span className="font-medium text-sm">
                    {usingRemoteApi ? '🌐 Vzdálené API' : '🏠 Lokální API'}
                </span>
                <span className="text-xs text-gray-500 hidden sm:inline">
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
                    <span className="hidden sm:inline">Test připojení</span>
                    <span className="sm:hidden">Test</span>
                </span>
                <button
                    onClick={testConnection}
                    disabled={testingConnection}
                    className="px-2 sm:px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 transition-colors"
                >
                    {testingConnection ? '🔄' : '🔍'}
                    <span className="hidden sm:inline ml-1">
                        {testingConnection ? 'Testuje...' : 'Test připojení'}
                    </span>
                </button>
            </div>

            {lastTestResult && (
                <div className="text-xs text-gray-600">
                    <div className="flex items-center justify-between">
                        <span>
                            {lastTestResult.success ? '✅ Úspěšné' : '❌ Neúspěšné'}
                        </span>
                        <span>{lastTestResult.duration}ms</span>
                    </div>
                    <div className="text-gray-500 mt-1">
                        {lastTestResult.timestamp.toLocaleTimeString('cs-CZ')}
                    </div>
                </div>
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
        <div className="mt-3 sm:mt-4 text-xs text-gray-500 space-y-1 hidden sm:block">
            <div><strong>Lokální API:</strong> Simulovaná data s regionálními loading charakteristikami</div>
            <div><strong>Vzdálené API:</strong> Skutečná data ze serveru combustion.radek18.com</div>
        </div>
    </div>
    );
};
