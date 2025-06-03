/**
 * DebugPanel - Pokročilý debug panel pro monitorování API a mapových operací
 * Poskytuje real-time sledování volání, cachingu a chybových stavů
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getLogColor, getLogIcon, type LogType } from '@/utils/statusHelpers';

/**
 * Typ pro debug log záznam
 */
interface DebugLog {
    id: string;
    timestamp: Date;
    type: LogType;
    message: string;
    data?: string;
}

/**
 * Props pro DebugPanel komponentu
 */
interface DebugPanelProps {
    maxLogs?: number;
}

/**
 * Debug panel komponenta
 */

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

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="btn-base fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 p-3 rounded-full shadow-lg z-50"
                title="Zobrazit debug panel"
            >
                🐛
            </button>
        );
    }

    return (
        <div className="panel-base fixed bottom-4 right-4 w-96 max-h-80 z-50 overflow-hidden">
            <div className="flex-header bg-gray-100 border-b">
                <h3 className="panel-title">Debug Panel</h3>
                <div className="flex-buttons">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="input-base text-xs"
                    >
                        <option value="all">Vše</option>
                        <option value="api">API</option>
                        <option value="viewport">Viewport</option>
                        <option value="cache">Cache</option>
                        <option value="error">Chyby</option>
                    </select>
                    <button
                        onClick={() => setLogs([])}
                        className="btn-base text-xs bg-gray-200 hover:bg-gray-300"
                        title="Vymazat logy"
                    >
                        🗑️
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="clickable-area text-gray-500 hover:text-gray-700"
                        title="Skrýt panel"
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className="overflow-y-auto max-h-64 p-2">
                {filteredLogs.length === 0 ? (
                    <div className="text-helper text-center py-4">
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
                                        </div>
                                        <div className="text-helper text-xs">
                                            {log.timestamp.toLocaleTimeString()}
                                        </div>
                                        {log.data && (
                                            <details className="mt-1">
                                                <summary className="clickable-area text-helper">
                                                    Data
                                                </summary>
                                                <pre className="mono-text bg-gray-50 p-1 rounded mt-1 overflow-auto">
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
