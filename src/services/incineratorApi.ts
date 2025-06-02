/**
 * incineratorApi.ts - API služba pro správu dat spaloven
 * Poskytuje rozhraní pro načítání dat s podporou lokálního i vzdáleného API
 * Zahrnuje simulaci latence a error handling
 */

import { incineratorData } from '@/data/incinerators';
import { Incinerator } from '@/types';
import { dynamicLogger } from '@/utils/DynamicDataLogger';

/**
 * Typ pro mapové hranice (viewport)
 */
export interface MapBounds {
    north: number;
    south: number;
    east: number;
    west: number;
}

/**
 * Typ pro API požadavek
 */
export interface ApiRequest {
    bounds: MapBounds;
    zoom: number;
    clustered?: boolean; // Pro budoucí clustering
}

/**
 * Typ pro API odpověď
 */
export interface ApiResponse {
    incinerators: Incinerator[];
    totalCount: number;
    clustered: boolean;
}

/**
 * Simulované API delay pro realistické testování
 */
const API_DELAY = 1200; // ms - prodlouženo pro lepší viditelnost loading stavu

/**
 * Geografické regiony pro simulaci dynamického načítání
 */
export interface Region {
    name: string;
    bounds: MapBounds;
    loadDelay: number; // specifické zpoždění pro region
}

const REGIONS: Region[] = [
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
 * Simuluje API volání s delay a logováním
 */
const simulateApiCall = async <T>(data: T, regionName: string, customDelay?: number): Promise<T> => {
    // Simulace variabilního zatížení serveru
    const baseDelay = customDelay || API_DELAY;
    const variability = Math.random() * 0.4 + 0.8; // 80-120% base delay
    const finalDelay = Math.floor(baseDelay * variability);

    // Simulace občasných pomalých requestů (5% šance)
    if (Math.random() < 0.05) {
        const slowDelay = finalDelay * 2;
        dynamicLogger.logSlowRequest(slowDelay, finalDelay);
        await new Promise(resolve => setTimeout(resolve, slowDelay));
    } else {
        await new Promise(resolve => setTimeout(resolve, finalDelay));
    }

    // Simulace občasných chyb (2% šance)
    if (Math.random() < 0.02) {
        throw new Error('Simulovaná chyba API - server dočasně nedostupný');
    }

    return data;
};

/**
 * Určuje region na základě viewport bounds
 */
export const getRegionForBounds = (bounds: MapBounds): Region | null => {
    for (const region of REGIONS) {
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
 * Filtruje spalovny podle geografických hranic a odstraňuje polygon data pro nízké zoom úrovně
 */
const filterIncineratorsByBounds = (incinerators: Incinerator[], bounds: MapBounds, zoom: number): Incinerator[] => {
    const filtered = incinerators.filter(incinerator => {
        const { lat, lng } = incinerator.location;
        return lat >= bounds.south &&
            lat <= bounds.north &&
            lng >= bounds.west &&
            lng <= bounds.east;
    });    // Optimalizace pro nízké zoom úrovně - odstraníme polygon data
    if (zoom < 14) {
        console.log(`🔍 Local API: Filtering out polygon data for zoom ${zoom} (< 14)`);
        const optimizedData = filtered.map(incinerator => {
            const hasPolygons = incinerator.propertyBoundary || (incinerator.buildings && incinerator.buildings.length > 0);
            if (hasPolygons) {
                console.log(`   ⚡ Optimizing ${incinerator.name}: removing ${incinerator.propertyBoundary ? 'property boundary' : ''}${incinerator.propertyBoundary && incinerator.buildings?.length ? ' + ' : ''}${incinerator.buildings?.length ? `${incinerator.buildings.length} buildings` : ''}`);
            }
            return {
                ...incinerator,
                propertyBoundary: undefined, // Odstraníme polygon areálu
                buildings: [] // Odstraníme budovy
            };
        });
        return optimizedData;
    } else {
        console.log(`🏗️ Local API: Including polygon data for zoom ${zoom} (>= 14)`);
        filtered.forEach(incinerator => {
            const hasPolygons = incinerator.propertyBoundary || (incinerator.buildings && incinerator.buildings.length > 0);
            if (hasPolygons) {
                console.log(`   🏗️ Including ${incinerator.name}: ${incinerator.propertyBoundary ? 'property boundary' : ''}${incinerator.propertyBoundary && incinerator.buildings?.length ? ' + ' : ''}${incinerator.buildings?.length ? `${incinerator.buildings.length} buildings` : ''}`);
            } else {
                console.log(`   📍 ${incinerator.name}: no polygon data available`);
            }
        });
        return filtered;
    }
};

/**
 * Určuje, zda by měly být data clustrována podle zoom úrovně
 */
const shouldCluster = (zoom: number): boolean => {
    return zoom < 10; // Clustering pro menší zoom
};

/**
 * Simuluje clustering spaloven (pro budoucí implementaci)
 */
const clusterIncinerators = (incinerators: Incinerator[]): Incinerator[] => {
    // Zatím jen vrací původní data, ale může být rozšířeno o clustering logiku
    return incinerators;
};

/**
 * Načte spalovny pro daný viewport a zoom úroveň
 */
export const fetchIncineratorsByViewport = async (request: ApiRequest): Promise<ApiResponse> => {
    const { bounds, zoom } = request;
    const region = getRegionForBounds(bounds);

    const regionName = region?.name || 'Neznámá oblast';

    // Logování request
    dynamicLogger.logApiRequest(regionName, bounds, zoom);
    dynamicLogger.logRegionDetection(regionName, region !== null);

    try {        // Simulace načítání pouze dat v aktuálním viewport
        let filteredIncinerators = filterIncineratorsByBounds(incineratorData, bounds, zoom);
        const originalCount = filteredIncinerators.length;

        // Simulace různého množství dat podle regionu a zoom úrovně
        const maxResults = getMaxResultsForZoomAndRegion(zoom, region);
        if (filteredIncinerators.length > maxResults) {
            filteredIncinerators = filteredIncinerators.slice(0, maxResults);
        }

        dynamicLogger.logDataFiltering(originalCount, filteredIncinerators.length, maxResults);

        // Simulace chybějících dat v některých regionech při nízkém zoom
        if (zoom < 8 && !region) {
            dynamicLogger.logError('Nízký zoom mimo hlavní regiony - žádná data dostupná');
            filteredIncinerators = [];
        }

        const clustered = shouldCluster(zoom);
        dynamicLogger.logClustering(clustered, zoom);

        if (clustered && filteredIncinerators.length > 0) {
            filteredIncinerators = clusterIncinerators(filteredIncinerators);
        }

        const totalInBounds = filterIncineratorsByBounds(incineratorData, bounds, zoom).length;

        const response: ApiResponse = {
            incinerators: filteredIncinerators,
            totalCount: totalInBounds,
            clustered
        };

        // Použij specifické zpoždění pro region nebo výchozí
        const expectedDelay = region?.loadDelay || API_DELAY;
        const startTime = Date.now();

        const result = await simulateApiCall(response, regionName, expectedDelay);

        const actualTime = Date.now() - startTime;
        dynamicLogger.logApiResponse(result.incinerators.length, result.totalCount, actualTime, regionName);

        return result;

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Neznámá chyba';
        dynamicLogger.logError(errorMessage);
        throw error;
    }
};

/**
 * Určuje maximální počet výsledků podle zoom úrovně a regionu
 */
const getMaxResultsForZoom = (zoom: number): number => {
    if (zoom < 8) return 20;   // Velmi daleko - pouze hlavní spalovny
    if (zoom < 10) return 50;  // Středně daleko - více spaloven
    if (zoom < 12) return 100; // Blízko - hodně spaloven
    return 200; // Velmi blízko - všechny spalovny
};

/**
 * Určuje maximální počet výsledků podle zoom úrovně a regionu
 */
const getMaxResultsForZoomAndRegion = (zoom: number, region: Region | null): number => {
    const baseLimit = getMaxResultsForZoom(zoom);

    if (!region) {
        // Mimo hlavní regiony - méně dat
        return Math.floor(baseLimit * 0.3);
    }

    // Různé regiony mají různé množství dat
    const regionMultiplier: Record<string, number> = {
        'Praha a okolí': 1.5,      // Praha má nejvíce spaloven
        'Brno a okolí': 1.0,       // Brno průměrně
        'Ostrava a okolí': 0.8,    // Ostrava méně
        'Severní Čechy': 1.2,      // Severní Čechy více (průmysl)
        'Jižní Čechy': 0.6         // Jižní Čechy méně (venkov)
    };

    const multiplier = regionMultiplier[region.name] || 1.0;
    return Math.floor(baseLimit * multiplier);
};

/**
 * Prediktivní načítání dat pro sousední oblasti
 * Načte data pro rozšířené hranice kolem aktuálního viewport
 */
export const prefetchNearbyData = async (bounds: MapBounds, zoom: number): Promise<ApiResponse> => {
    const PREFETCH_EXPANSION = 0.1; // 10% rozšíření hranic

    const latExpansion = (bounds.north - bounds.south) * PREFETCH_EXPANSION;
    const lngExpansion = (bounds.east - bounds.west) * PREFETCH_EXPANSION;

    const expandedBounds: MapBounds = {
        north: bounds.north + latExpansion,
        south: bounds.south - latExpansion,
        east: bounds.east + lngExpansion,
        west: bounds.west - lngExpansion
    };

    console.log('Prefetching data for expanded bounds:', expandedBounds);

    return fetchIncineratorsByViewport({
        bounds: expandedBounds,
        zoom,
        clustered: shouldCluster(zoom)
    });
};

/**
 * Cache pro uložení načtených dat
 */
class DataCache {
    private cache = new Map<string, { data: ApiResponse; timestamp: number }>();
    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minut

    private getCacheKey(bounds: MapBounds, zoom: number): string {
        return `${bounds.north}-${bounds.south}-${bounds.east}-${bounds.west}-${zoom}`;
    }

    get(bounds: MapBounds, zoom: number): ApiResponse | null {
        const key = this.getCacheKey(bounds, zoom);
        const cached = this.cache.get(key);

        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
            console.log('Data loaded from cache:', key);
            return cached.data;
        }

        return null;
    }

    set(bounds: MapBounds, zoom: number, data: ApiResponse): void {
        const key = this.getCacheKey(bounds, zoom);
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
        console.log('Data cached:', key);
    }

    clear(): void {
        this.cache.clear();
        console.log('Cache cleared');
    }
}

export const dataCache = new DataCache();

/**
 * Načte data s využitím cache
 */
export const fetchIncineratorsWithCache = async (request: ApiRequest): Promise<ApiResponse> => {
    // Zkus načíst z cache
    const cached = dataCache.get(request.bounds, request.zoom);
    if (cached) {
        return cached;
    }

    // Načti z API
    const data = await fetchIncineratorsByViewport(request);

    // Ulož do cache
    dataCache.set(request.bounds, request.zoom, data);

    return data;
};
