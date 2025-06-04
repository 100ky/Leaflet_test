/**
 * LiveDebugPanel - Komponenta pro zobrazení live logů z API
 * Poskytuje real-time monitoring API volání s možností auto-scrollu
 */

'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { logger } from '@/utils/logger';
import { Panel } from '../ui/Panel';
import { LogView, type LogEntry } from '../ui/LogView';
import { getLogIcon, getLogColor, type LogType } from '@/utils/statusHelpers';

/**
 * Komponenta pro zobrazení live debug logů
 */

export const LiveDebugPanel: React.FC = () => {
    const [rawLogs, setRawLogs] = useState<string[]>([]);
    const [expanded, setExpanded] = useState(false);
    const [autoScroll, setAutoScroll] = useState(true);
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const newLogs = logger.getLogHistory();
            setRawLogs(newLogs);
        }, 500);

        return () => clearInterval(interval);
    }, []);

    const formattedLogs: LogEntry[] = useMemo(() => {
        return rawLogs.map((logString, index) => {
            let type: LogType = 'info'; // Default type
            // Jednoduchá detekce typu z emoji - může být rozšířeno
            if (logString.includes('🔍')) type = 'debug';
            else if (logString.includes('ℹ️')) type = 'info';
            else if (logString.includes('⚠️')) type = 'warning';
            else if (logString.includes('❌')) type = 'error';
            else if (logString.includes('✅')) type = 'success';
            else if (logString.includes('📡')) type = 'api';
            else if (logString.includes('⚙️')) type = 'system';
            else if (logString.includes('⏳')) type = 'loading';

            // Extrahovat časovou značku, pokud je na začátku logu ve formátu [HH:MM:SS]
            const timeMatch = logString.match(/^\\[(.*?)\\]/);
            let message = logString;
            const timestamp = new Date(); // Fallback na aktuální čas, opraveno na const, protože se přepisují jen její properties

            if (timeMatch && timeMatch[1]) {
                const timeParts = timeMatch[1].split(':');
                if (timeParts.length === 3) {
                    timestamp.setHours(parseInt(timeParts[0], 10));
                    timestamp.setMinutes(parseInt(timeParts[1], 10));
                    timestamp.setSeconds(parseInt(timeParts[2], 10));
                    message = logString.substring(timeMatch[0].length).trim(); // Odebrat časovou značku ze zprávy
                }
            }

            return {
                id: `${timestamp.getTime()}-${index}-${Math.random().toString(36).substring(7)}`,
                timestamp: timestamp,
                type: type,
                message: message,
            };
        });
    }, [rawLogs]);

    // Auto-scroll logs uvnitř kontejneru
    useEffect(() => {
        if (autoScroll && expanded && formattedLogs.length > 0 && logContainerRef.current) {
            const container = logContainerRef.current;
            container.scrollTop = container.scrollHeight;
        }
    }, [formattedLogs, autoScroll, expanded]);

    const clearLogs = () => {
        logger.clearLogs();
        setRawLogs([]);
    };

    const exportLogs = () => {
        const logText = rawLogs.join('\n');
        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `live-api-logs-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const panelTitle = (
        <span>
            🔍 <span className="responsive-inline">Live Debug Panel - API</span>
            <span className="hidden-desktop">Debug</span>
        </span>
    );

    const panelHeaderContent = (
        <>
            <span className="text-xs badge-blue">
                {formattedLogs.length}
            </span>
            <div className="flex-status">
                <div className="status-dot bg-green-400 animate-pulse"></div>
                <span className="text-helper">Live</span>
            </div>
        </>
    );

    const renderLiveLogItem = (log: LogEntry) => (
        <div key={log.id} className="mb-1 break-words text-xs">
            <span className={getLogColor(log.type)}>
                {getLogIcon(log.type)} [{log.timestamp.toLocaleTimeString()}]
            </span> {log.message}
        </div>
    );

    return (
        <div className="w-full">
            <Panel
                title={panelTitle}
                headerContent={panelHeaderContent}
                isCollapsible={true}
                initiallyExpanded={false}
                onToggle={setExpanded}
                className={`transition-none ${expanded ? 'expanded' : ''}`}
            >
                <div className="controls p-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <button onClick={clearLogs} className="button-secondary-xs mr-2">
                            🗑️ Vyčistit
                        </button>
                        <button onClick={exportLogs} className="button-secondary-xs">
                            💾 Exportovat
                        </button>
                    </div>
                    <label className="flex items-center text-xs">
                        <input
                            type="checkbox"
                            checked={autoScroll}
                            onChange={(e) => setAutoScroll(e.target.checked)}
                            className="mr-1"
                        />
                        Auto-scroll
                    </label>
                </div>
                <div
                    ref={logContainerRef}
                    className="h-80 overflow-y-auto"
                    style={{ maxHeight: '320px' }}
                >
                    <LogView
                        logs={formattedLogs}
                        renderLogItem={renderLiveLogItem}
                        className="text-xs p-2"
                    />
                </div>
            </Panel>
        </div>
    );
};
