/**
 * Univerzální Panel komponenta
 * 
 * Poskytuje základní UI panel s možností sbalení/rozbalení.
 * Podporuje vlastní hlavičku, obsah a styling.
 * Využívá se pro všechny panely v aplikaci České spalovny.
 * 
 * @component
 */
'use client';

import { useState, type ReactNode } from 'react';

/**
 * Props pro Panel komponentu
 */
interface PanelProps {
    title: ReactNode;
    children: ReactNode;
    className?: string;
    isCollapsible?: boolean;
    initiallyExpanded?: boolean;
    headerContent?: ReactNode; // Obsah hlavičky vedle titulku
    onToggle?: (expanded: boolean) => void; // Callback při změně stavu sbalení/rozbalení
}

export const Panel: React.FC<PanelProps> = ({
    title,
    children,
    className,
    isCollapsible,
    initiallyExpanded = true,
    headerContent,
    onToggle,
}) => {
    const [expanded, setExpanded] = useState(initiallyExpanded);

    const handleToggle = () => {
        if (isCollapsible) {
            const newState = !expanded;
            setExpanded(newState);
            if (onToggle) {
                onToggle(newState);
            }
        }
    };

    return (
        <div className={`panel-base ${className || ''}`}>
            <div
                className={`panel-content ${isCollapsible ? 'clickable-area' : ''}`}
                onClick={handleToggle}
                role={isCollapsible ? 'button' : undefined}
                tabIndex={isCollapsible ? 0 : undefined}
                onKeyDown={isCollapsible ? (e) => { if (e.key === 'Enter' || e.key === ' ') handleToggle(); } : undefined}
                aria-expanded={isCollapsible ? expanded : undefined}
            >
                <div className="flex-header">
                    <h3 className="panel-title">{title}</h3>
                    {headerContent && <div className="ml-auto flex items-center">{headerContent}</div>}
                    {isCollapsible && (
                        <span className="ml-2 text-gray-600 transition-transform duration-200 transform group-hover:text-gray-700" style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
                            ▼
                        </span>
                    )}
                </div>
            </div>
            {(!isCollapsible || expanded) && (
                <div className={`panel-content transition-none ${isCollapsible ? 'border-t bg-gray-50' : ''}`}>
                    {children}
                </div>
            )}
        </div>
    );
};
