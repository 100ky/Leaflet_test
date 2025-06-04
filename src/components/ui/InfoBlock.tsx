'use client';

import type { ReactNode } from 'react';

interface InfoBlockProps {
    label: ReactNode;
    value: ReactNode;
    className?: string;
    labelClassName?: string;
    valueClassName?: string;
}

export const InfoBlock: React.FC<InfoBlockProps> = ({
    label,
    value,
    className = '',
    labelClassName = '',
    valueClassName = '',
}) => {
    return (
        <div className={`info-block ${className}`}>
            <dt className={`info-block-label ${labelClassName}`}>{label}</dt>
            <dd className={`info-block-value ${valueClassName}`}>{value}</dd>
        </div>
    );
};
