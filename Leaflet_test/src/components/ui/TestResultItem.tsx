'use client';

import type { ReactNode } from 'react';

export type TestStatus = 'success' | 'error' | 'pending' | 'info';

interface TestResultItemProps {
    title: ReactNode;
    status: TestStatus;
    details?: ReactNode;
    timestamp?: Date;
    icon?: ReactNode;
    className?: string;
}

const StatusIcon: React.FC<{ status: TestStatus }> = ({ status }) => {
    switch (status) {
        case 'success':
            return <span className="text-green-500">✓</span>;
        case 'error':
            return <span className="text-red-500">✗</span>;
        case 'pending':
            return <span className="text-yellow-500">…</span>;
        case 'info':
            return <span className="text-blue-500">ℹ️</span>;
        default:
            return null;
    }
};

export const TestResultItem: React.FC<TestResultItemProps> = ({
    title,
    status,
    details,
    timestamp,
    icon,
    className = '',
}) => {
    return (
        <div className={`test-result-item p-3 rounded-md border ${className} ${status === 'error' ? 'border-red-200 bg-red-50' : status === 'success' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {icon ? <span className="mr-2">{icon}</span> : <StatusIcon status={status} />}
                    <h4 className="font-medium text-sm mr-2">{title}</h4>
                </div>
                {timestamp && (
                    <div className="text-xs text-gray-700">
                        {timestamp.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                )}
            </div>
            {details && (
                <div className="mt-2 text-xs text-gray-700">
                    {details}
                </div>
            )}
        </div>
    );
};
