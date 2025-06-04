/**
 * DebugPanel - Pokročilý debug panel pro monitorování API a mapových operací
 * Poskytuje real-time sledování volání, cachingu a chybových stavů
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { type LogType } from '@/utils/statusHelpers';
import { Panel } from '../ui/Panel';
import { LogView, type LogEntry as UiLogEntry } from '../ui/LogView';

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
    const [logs, setLogs] = useState<UiLogEntry[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const [filter, setFilter] = useState<string>('all');

    const addLog = useCallback((type: LogType, message: string, data?: unknown) => {
        const newLog: UiLogEntry = {
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

                let type: LogType = 'api';
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
            addLog('error', message, args.length > 1 ? args[1] : undefined); // Původně zde bylo 'warn', ale LogType nemá 'warn', používám 'error'
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

    const panelHeaderContent = (
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
                {/* Přidána možnost pro loading, pokud je relevantní */}
                <option value="loading">Načítání</option>
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
                className="clickable-area text-gray-600 hover:text-gray-800"
                title="Skrýt panel"
            >
                ✕
            </button>
        </div>
    );

    return (
        // Původní kontejner pro pozicování zůstává
        <div className="fixed bottom-4 right-4 w-96 max-h-80 z-50 overflow-hidden">
            <Panel
                title="Debug Panel"
                headerContent={panelHeaderContent}
                isCollapsible={false} // Není sbalitelný sám o sobě, viditelnost řídí isVisible
                className="panel-base" // Použijeme původní třídy pro konzistentní vzhled
            >
                {/* Obsah panelu - zobrazení logů */}
                <LogView
                    logs={filteredLogs}
                    className="max-h-64 p-2 bg-white"
                />
            </Panel>
        </div>
    );
};
