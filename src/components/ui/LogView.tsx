
import React from 'react';
import { getLogColor, getLogIcon, type LogType } from '@/utils/statusHelpers';

export interface LogEntry {
    id: string;
    timestamp: Date;
    type: LogType;
    message: string;
    data?: string;
}

interface LogViewProps {
    logs: LogEntry[];
    className?: string;
    style?: React.CSSProperties;
    renderLogItem?: (log: LogEntry) => React.ReactNode;
}

export const LogView: React.FC<LogViewProps> = ({ logs, className, style, renderLogItem }) => {
    if (logs.length === 0) {
        return (
            <div className="text-helper text-center py-4">
                Žádné logy k zobrazení
            </div>
        );
    }

    return (
        <div className={`h-full ${className || ''}`} style={style}>
            <div className="space-y-1">
                {logs.map(log =>
                    renderLogItem ? renderLogItem(log) : (
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
                    )
                )}
            </div>
        </div>
    );
};
