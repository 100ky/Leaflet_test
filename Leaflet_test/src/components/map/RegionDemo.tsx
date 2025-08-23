/**
 * Komponenta pro demonstraci regionů a jejich loading charakteristik
 * Regiony jsou načítány z centralizovaného souboru /constants/regions.ts
 */

'use client';

import { useState } from 'react';
import { DEMO_REGIONS, DemoRegion } from '@/constants/regions';

interface RegionDemoProps {
    onRegionSelect: (bounds: { north: number; south: number; east: number; west: number }, zoom: number) => void;
}

export const RegionDemo: React.FC<RegionDemoProps> = ({ onRegionSelect }) => {
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);

    const handleRegionClick = (region: DemoRegion) => {
        setSelectedRegion(region.name);
        onRegionSelect(region.bounds, region.zoom);
    };

    return (<div className="panel-base">
        <div
            className="panel-content clickable-area"
            onClick={() => setExpanded(!expanded)}
        >
            <div className="flex-header">
                <h3 className="panel-title flex items-center">
                    🗺️ <span className="responsive-inline">Demo regionů - Testování dynamického načítání</span>
                    <span className="hidden-desktop">Demo regionů</span>
                </h3>
                <div className="flex-status">
                    <span className="text-responsive text-gray-600 hidden md:inline">
                        {selectedRegion || 'Žádný region vybrán'}
                    </span>
                    <span className="text-gray-400">
                        {expanded ? '▼' : '▶'}
                    </span>
                </div>
            </div>
        </div>            {expanded && (
            <div className="border-t border-gray-200 panel-content bg-gray-50">
                <div className="mb-3 sm:mb-4 text-responsive text-gray-600">
                    💡 Klikněte na region pro přeskok mapy a testování loading charakteristik
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                    {DEMO_REGIONS.map((region) => (
                        <button
                            key={region.name}
                            onClick={() => handleRegionClick(region)}
                            className={`p-2 sm:p-3 rounded-lg border text-left transition-all hover:shadow-md ${selectedRegion === region.name
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-start space-x-2 sm:space-x-3">
                                <span className="text-lg sm:text-2xl">{region.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-800 text-responsive">
                                        {region.name}
                                    </div>
                                    <div className="text-label mt-1 hidden-mobile">
                                        {region.description}
                                    </div>
                                    <div className="mt-1 sm:mt-2 section-spacing-sm">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-700">Loading:</span>
                                            <span className="mono-text text-orange-600">
                                                {region.expectedLoadTime}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs hidden-mobile">
                                            <span className="text-gray-700">Data:</span>
                                            <span className="mono-text text-blue-600">
                                                {region.dataAmount}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-700">Zoom:</span>
                                            <span className="mono-text text-purple-600">
                                                {region.zoom}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded">
                    <div className="text-xs text-blue-700">
                        🎯 <strong>Jak testovat:</strong>
                        <span className="hidden sm:inline"> Vyberte různé regiony a sledujte změny v Live Debug Panel.
                            Každý region má jiné loading časy a množství dat. Praha je nejrychlejší, neznámé oblasti nejpomalejší.</span>
                        <span className="sm:hidden"> Vyberte region a sledujte loading časy v Debug panelu.</span>
                    </div>
                </div>
            </div>
        )}
    </div>
    );
};
