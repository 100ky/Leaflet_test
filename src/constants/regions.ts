/**
 * Centralizované definice regionů České republiky
 * Obsahuje všechny geografické oblasti používané v aplikaci
 */

import { MapBounds } from '@/services/incineratorApi';

/**
 * Základní typ pro geografický region
 */
export interface BaseRegion {
    name: string;
    bounds: MapBounds;
}

/**
 * Region s API charakteristikami pro backend simulaci
 */
export interface ApiRegion extends BaseRegion {
    loadDelay: number; // specifické zpoždění pro region v ms
}

/**
 * Region s demo charakteristikami pro UI testování
 */
export interface DemoRegion extends BaseRegion {
    description: string;
    center: [number, number]; // [lat, lng]
    zoom: number;
    expectedLoadTime: string;
    dataAmount: string;
    icon: string;
}

/**
 * Základní regiony České republiky pro API simulaci
 */
export const API_REGIONS: ApiRegion[] = [
    {
        name: 'Praha a okolí',
        bounds: { north: 50.2, south: 49.9, east: 14.8, west: 14.2 },
        loadDelay: 600
    },
    {
        name: 'Brno a okolí',
        bounds: { north: 49.3, south: 49.1, east: 16.8, west: 16.4 },
        loadDelay: 800
    },
    {
        name: 'Ostrava a okolí',
        bounds: { north: 49.9, south: 49.7, east: 18.5, west: 18.1 },
        loadDelay: 1000
    },
    {
        name: 'Severní Čechy',
        bounds: { north: 50.8, south: 50.3, east: 15.0, west: 13.5 },
        loadDelay: 900
    },
    {
        name: 'Jižní Čechy',
        bounds: { north: 49.5, south: 48.5, east: 15.0, west: 13.5 },
        loadDelay: 700
    }
];

/**
 * Demo regiony pro UI testování s rozšířenými informacemi
 */
export const DEMO_REGIONS: DemoRegion[] = [
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

/**
 * Test regiony pro API testování
 */
export const TEST_REGIONS = [
    {
        name: 'Praha oblast',
        bounds: { north: 50.2, south: 49.9, east: 14.7, west: 14.2 },
        zoom: 11
    },
    {
        name: 'Brno oblast',
        bounds: { north: 49.3, south: 49.1, east: 16.8, west: 16.5 },
        zoom: 11
    },
    {
        name: 'Celá ČR',
        bounds: { north: 51.0, south: 48.5, east: 18.9, west: 12.1 },
        zoom: 7
    }
];

/**
 * Helper funkce pro práci s regiony
 */

/**
 * Najde region podle granic (pro API simulaci)
 */
export const getApiRegionForBounds = (bounds: MapBounds): ApiRegion | null => {
    for (const region of API_REGIONS) {
        // Zkontroluj překryv s regionem
        const hasOverlap = !(
            bounds.north < region.bounds.south ||
            bounds.south > region.bounds.north ||
            bounds.east < region.bounds.west ||
            bounds.west > region.bounds.east
        );

        if (hasOverlap) {
            return region;
        }
    }
    return null; // Neznámý region
};

/**
 * Získá regionový multiplikátor pro množství dat
 */
export const getRegionDataMultiplier = (regionName: string | null): number => {
    if (!regionName) return 0.3; // Mimo hlavní regiony - méně dat

    const regionMultiplier: Record<string, number> = {
        'Praha a okolí': 1.5,      // Praha má nejvíce spaloven
        'Brno a okolí': 1.0,       // Brno průměrně
        'Ostrava a okolí': 0.8,    // Ostrava méně
        'Severní Čechy': 1.2,      // Severní Čechy více (průmysl)
        'Jižní Čechy': 0.6         // Jižní Čechy méně (venkov)
    };

    return regionMultiplier[regionName] || 1.0;
};

/**
 * Získá všechna jména regionů
 */
export const getAllRegionNames = (): string[] => {
    return API_REGIONS.map(region => region.name);
};

/**
 * Najde demo region podle názvu
 */
export const getDemoRegionByName = (name: string): DemoRegion | null => {
    return DEMO_REGIONS.find(region => region.name === name) || null;
};
