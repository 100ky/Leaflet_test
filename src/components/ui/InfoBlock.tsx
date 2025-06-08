/**
 * InfoBlock komponenta pro zobrazení páru štítek-hodnota
 * 
 * Jednoduché UI komponenta pro strukturované zobrazení informací.
 * Používá se v panelech a kartách pro konzistentní formatování dat.
 * Podporuje vlastní styling pro štítek i hodnotu.
 * 
 * @component
 */
'use client';

import type { ReactNode } from 'react';

/**
 * Props pro InfoBlock komponentu
 */
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
