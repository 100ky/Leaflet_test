/**
 * LiveDebugPanel - Komponenta pro zobrazení live logů z API
 * Poskytuje real-time monitoring API volání s možností auto-scrollu
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { logger } from '@/utils/logger';
import { getExpandIcon } from '@/utils/statusHelpers';

/**
 * Komponenta pro zobrazení live debug logů
 */

export const LiveDebugPanel: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [expanded, setExpanded] = useState(false);
    const [autoScroll, setAutoScroll] = useState(true);
    const logContainerRef = useRef<HTMLDivElement>(null); useEffect(() => {
        // Aktualizuj logy každých 500ms
        const interval = setInterval(() => {
            const newLogs = logger.getLogHistory();
            setLogs(newLogs);
        }, 500);

        return () => clearInterval(interval);
    }, []);    // Auto-scroll efekt pouze uvnitř log kontejneru - bez scrollIntoView
    useEffect(() => {
        if (autoScroll && expanded && logContainerRef.current && logs.length > 0) {
            // Použij scrollTop místo scrollIntoView pro zabránění page scroll
            const container = logContainerRef.current;
            setTimeout(() => {
                container.scrollTop = container.scrollHeight;
            }, 0);
        }
    }, [logs, autoScroll, expanded]);

    const handlePanelToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setExpanded(!expanded);
    };

    const clearLogs = () => {
        logger.clearLogs();
        setLogs([]);
    };

    const exportLogs = () => {
        const logText = logs.join('\n');
        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `api-logs-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="panel-base">
            <div
                className="panel-content clickable-area"
                onClick={handlePanelToggle}
            >
                <div className="flex-header">
                    <h3 className="panel-title">
                        🔍 <span className="responsive-inline">Live Debug Panel - API</span>
                        <span className="hidden-desktop">Debug</span>                        <span className="text-xs badge-blue">
                            {logs.length}
                        </span>
                    </h3>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <div className="flex-status">
                            <div className="status-dot bg-green-400 animate-pulse"></div>
                            <span className="text-helper">Live</span>
                        </div>
                        <span className="text-helper">
                            {getExpandIcon(expanded)}
                        </span>
                    </div>
                </div>
            </div>{expanded && (
            <div className="panel-content border-t bg-gray-50">
                <div className="flex-header mb-3 sm:mb-4">
                    <div className="flex-buttons w-full sm:w-auto">
                        <button
                            onClick={clearLogs}
                            className="btn-base btn-red flex-1 sm:flex-none"
                        >
                            🗑️ <span className="hidden-mobile">Vymazat</span>
                        </button>
                        <button
                            onClick={exportLogs}
                            className="btn-base btn-blue flex-1 sm:flex-none"
                        >
                            💾 <span className="hidden-mobile">Export</span>
                        </button>
                    </div>
                    <label className="checkbox-wrapper text-responsive w-full sm:w-auto justify-center sm:justify-start">
                        <input
                            type="checkbox"
                            checked={autoScroll}
                            onChange={(e) => setAutoScroll(e.target.checked)}
                            className="rounded"
                        />
                        <span>Auto scroll</span>
                    </label>
                </div>

                <div
                    ref={logContainerRef}
                    className="bg-black text-green-400 p-2 sm:p-4 rounded-lg font-mono text-xs sm:text-sm h-48 sm:h-64 overflow-y-auto"
                    style={{ scrollBehavior: 'auto' }}
                >
                    {logs.length === 0 ? (
                        <div className="text-gray-500 text-center mt-12 sm:mt-20 text-xs sm:text-sm">
                            Žádné logy k zobrazení... <br className="sm:hidden" />
                            Začněte interakcí s mapou.
                        </div>
                    ) : (
                        <div>
                            {logs.map((log, index) => (
                                <div key={index} className="mb-1 break-words">
                                    {log}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-3 sm:mt-4 text-xs text-gray-500">
                    💡 <strong>Tip:</strong> <span className="hidden sm:inline">Interagujte s mapou (zoom, posun) pro zobrazení API aktivit v reálném čase.
                        Logy se automaticky aktualizují každých 500ms.</span>
                    <span className="sm:hidden">Pohybujte s mapou pro zobrazení logů.</span>
                </div>
            </div>
        )}
        </div>
    );
};
