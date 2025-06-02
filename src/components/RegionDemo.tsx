/**
 * Komponenta pro demonstraci regionů a jejich loading charakteristik
 */

'use client';

import { useState } from 'react';

interface RegionDemoProps {
    onRegionSelect: (bounds: { north: number; south: number; east: number; west: number }, zoom: number) => void;
}

interface DemoRegion {
    name: string;
    description: string;
    center: [number, number]; // [lat, lng]
    zoom: number;
    bounds: { north: number; south: number; east: number; west: number };
    expectedLoadTime: string;
    dataAmount: string;
    icon: string;
}

const DEMO_REGIONS: DemoRegion[] = [
    {
        name: 'Praha a okolí',
        description: 'Nejvíce spaloven, rychlé načítání',
        center: [50.0755, 14.4378],
        zoom: 11,
        bounds: { north: 50.2, south: 49.9, east: 14.8, west: 14.2 },
        expectedLoadTime: '600-800ms',
        dataAmount: 'Vysoké (+50% více dat)',
        icon: '🏛️'
    },
    {
        name: 'Brno a okolí',
        description: 'Středně velké město, průměrné načítání',
        center: [49.1951, 16.6068],
        zoom: 11,
        bounds: { north: 49.3, south: 49.1, east: 16.8, west: 16.4 },
        expectedLoadTime: '800-1000ms',
        dataAmount: 'Střední (normální množství)',
        icon: '🏭'
    },
    {
        name: 'Ostrava a okolí',
        description: 'Průmyslová oblast, pomalejší načítání',
        center: [49.8209, 18.2625],
        zoom: 11,
        bounds: { north: 49.9, south: 49.7, east: 18.5, west: 18.1 },
        expectedLoadTime: '1000-1200ms',
        dataAmount: 'Střední (-20% méně dat)',
        icon: '⚡'
    },
    {
        name: 'Severní Čechy',
        description: 'Velkoplošný region, více spaloven',
        center: [50.6, 14.2],
        zoom: 9,
        bounds: { north: 50.8, south: 50.3, east: 15.0, west: 13.5 },
        expectedLoadTime: '900-1100ms',
        dataAmount: 'Vysoké (+20% více dat)',
        icon: '🏔️'
    },
    {
        name: 'Jižní Čechy',
        description: 'Venkovská oblast, méně dat',
        center: [49.0, 14.2],
        zoom: 9,
        bounds: { north: 49.5, south: 48.5, east: 15.0, west: 13.5 },
        expectedLoadTime: '700-900ms',
        dataAmount: 'Nízké (-40% méně dat)',
        icon: '🌾'
    },
    {
        name: 'Neznámá oblast',
        description: 'Oblast mimo hlavní regiony',
        center: [48.5, 17.0],
        zoom: 8,
        bounds: { north: 48.7, south: 48.3, east: 17.3, west: 16.7 },
        expectedLoadTime: '1200-1500ms',
        dataAmount: 'Velmi nízké (minimum dat)',
        icon: '❓'
    }
];

export const RegionDemo: React.FC<RegionDemoProps> = ({ onRegionSelect }) => {
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);

    const handleRegionClick = (region: DemoRegion) => {
        setSelectedRegion(region.name);
        onRegionSelect(region.bounds, region.zoom);
    };

    return (<div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div
            className="p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setExpanded(!expanded)}
        >
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 flex items-center text-sm sm:text-base">
                    🗺️ <span className="hidden sm:inline">Demo regionů - Testování dynamického načítání</span>
                    <span className="sm:hidden">Demo regionů</span>
                </h3>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <span className="text-xs sm:text-sm text-gray-600 hidden md:inline">
                        {selectedRegion || 'Žádný region vybrán'}
                    </span>
                    <span className="text-gray-400">
                        {expanded ? '▼' : '▶'}
                    </span>
                </div>
            </div>
        </div>            {expanded && (
            <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50">
                <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600">
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
                                    <div className="font-medium text-gray-800 text-xs sm:text-sm">
                                        {region.name}
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1 hidden sm:block">
                                        {region.description}
                                    </div>
                                    <div className="mt-1 sm:mt-2 space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Loading:</span>
                                            <span className="font-mono text-orange-600 text-xs">
                                                {region.expectedLoadTime}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs sm:block hidden">
                                            <span className="text-gray-500">Data:</span>
                                            <span className="font-mono text-blue-600 text-xs">
                                                {region.dataAmount}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Zoom:</span>
                                            <span className="font-mono text-purple-600 text-xs">
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
