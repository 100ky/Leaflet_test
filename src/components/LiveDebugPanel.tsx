/**
 * Komponenta pro zobrazení live logů z API
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { dynamicLogger } from '@/utils/DynamicDataLogger';

export const LiveDebugPanel: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [expanded, setExpanded] = useState(false);
    const [autoScroll, setAutoScroll] = useState(true);
    const logContainerRef = useRef<HTMLDivElement>(null); useEffect(() => {
        // Aktualizuj logy každých 500ms
        const interval = setInterval(() => {
            const newLogs = dynamicLogger.getLogHistory();
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
        dynamicLogger.clearLogs();
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
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">            <div
            className="p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={handlePanelToggle}
        >
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 flex items-center text-sm sm:text-base">
                    🔍 <span className="hidden sm:inline">Live Debug Panel - API</span>
                    <span className="sm:hidden">Debug</span>
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {logs.length}
                    </span>
                </h3>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className="hidden sm:flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="text-sm text-gray-600">Live</span>
                    </div>
                    <span className="text-gray-400 text-sm sm:text-base">
                        {expanded ? '▼' : '▶'}
                    </span>
                </div>
            </div>
        </div>            {expanded && (
            <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50">
                <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                        <button
                            onClick={clearLogs}
                            className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex-1 sm:flex-none"
                        >
                            🗑️ <span className="hidden sm:inline">Vymazat</span>
                        </button>
                        <button
                            onClick={exportLogs}
                            className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex-1 sm:flex-none"
                        >
                            💾 <span className="hidden sm:inline">Export</span>
                        </button>
                    </div>
                    <label className="flex items-center space-x-2 text-xs sm:text-sm w-full sm:w-auto justify-center sm:justify-start">
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
