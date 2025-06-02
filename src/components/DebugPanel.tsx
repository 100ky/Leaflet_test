/**
 * Debug panel pro monitorování API volání a stavu mapy
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

interface DebugLog {
    id: string;
    timestamp: Date;
    type: 'api' | 'viewport' | 'cache' | 'error' | 'loading';
    message: string;
    data?: string;
}

interface DebugPanelProps {
    maxLogs?: number;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ maxLogs = 100 }) => {
    const [logs, setLogs] = useState<DebugLog[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const [filter, setFilter] = useState<string>('all'); const addLog = useCallback((type: DebugLog['type'], message: string, data?: unknown) => {
        const newLog: DebugLog = {
            id: `${Date.now()}-${Math.random()}`,
            timestamp: new Date(),
            type,
            message,
            data: data ? JSON.stringify(data, null, 2) : undefined
        };

        setLogs(prev => {
            const updated = [newLog, ...prev];
            return updated.slice(0, maxLogs);
        });
    }, [maxLogs]);

    useEffect(() => {
        // Přepis console.log pro zachytávání debug zpráv
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        console.log = (...args) => {
            const message = args.join(' ');

            // Filtrovat pouze relevantní zprávy
            if (message.includes('API') || message.includes('Fetching') ||
                message.includes('🚀') || message.includes('✅') || message.includes('🔄') ||
                message.includes('Viewport') || message.includes('Cache') ||
                message.includes('📍') || message.includes('📊')) {

                let type: DebugLog['type'] = 'api';
                if (message.includes('Viewport') || message.includes('📍')) type = 'viewport';
                if (message.includes('Cache')) type = 'cache';
                if (message.includes('🔄') || message.includes('Načítá')) type = 'loading';

                addLog(type, message, args.length > 1 ? args[1] : undefined);
            }

            originalLog(...args);
        };

        console.error = (...args) => {
            const message = args.join(' ');
            addLog('error', message, args.length > 1 ? args[1] : undefined);
            originalError(...args);
        };

        console.warn = (...args) => {
            const message = args.join(' ');
            addLog('error', message, args.length > 1 ? args[1] : undefined);
            originalWarn(...args);
        }; return () => {
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;
        };
    }, [maxLogs, addLog]);

    const filteredLogs = logs.filter(log =>
        filter === 'all' || log.type === filter
    );

    const getLogColor = (type: DebugLog['type']) => {
        switch (type) {
            case 'api': return 'text-blue-600';
            case 'viewport': return 'text-green-600';
            case 'cache': return 'text-purple-600';
            case 'error': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const getLogIcon = (type: DebugLog['type']) => {
        switch (type) {
            case 'api': return '🌐';
            case 'viewport': return '🗺️';
            case 'cache': return '💾';
            case 'error': return '❌';
            default: return 'ℹ️';
        }
    };

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
                title="Zobrazit debug panel"
            >
                🐛
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 w-96 max-h-80 bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="flex items-center justify-between p-3 bg-gray-100 border-b">
                <h3 className="font-semibold text-gray-800">Debug Panel</h3>
                <div className="flex items-center space-x-2">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="text-xs border rounded px-2 py-1"
                    >
                        <option value="all">Vše</option>
                        <option value="api">API</option>
                        <option value="viewport">Viewport</option>
                        <option value="cache">Cache</option>
                        <option value="error">Chyby</option>
                    </select>
                    <button
                        onClick={() => setLogs([])}
                        className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                        title="Vymazat logy"
                    >
                        🗑️
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-gray-500 hover:text-gray-700"
                        title="Skrýt panel"
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className="overflow-y-auto max-h-64 p-2">
                {filteredLogs.length === 0 ? (
                    <div className="text-gray-500 text-sm text-center py-4">
                        Žádné logy k zobrazení
                    </div>
                ) : (
                    <div className="space-y-1">
                        {filteredLogs.map(log => (
                            <div key={log.id} className="text-xs border-b border-gray-100 pb-1">
                                <div className="flex items-start space-x-2">
                                    <span>{getLogIcon(log.type)}</span>
                                    <div className="flex-1">
                                        <div className={`font-mono ${getLogColor(log.type)}`}>
                                            {log.message}
                                        </div>                                        <div className="text-gray-400 text-xs">
                                            {log.timestamp.toLocaleTimeString()}
                                        </div>
                                        {log.data && (
                                            <details className="mt-1">
                                                <summary className="cursor-pointer text-gray-500">
                                                    Data
                                                </summary>
                                                <pre className="text-xs bg-gray-50 p-1 rounded mt-1 overflow-auto">
                                                    {log.data}
                                                </pre>
                                            </details>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
