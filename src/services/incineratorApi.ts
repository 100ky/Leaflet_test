/**
 * API služba pro správu dat spaloven
 * 
 * Poskytuje centralizované rozhraní pro načítání dat spaloven s podporou:
 * - Lokálních statických dat pro development
 * - Vzdáleného API pro produkční data
 * - Simulace network latence a error stavů
 * - Cache management a optimalizace
 * - Filtrování podle map bounds a regionů
 * 
 * Služba automaticky detekuje dostupnost vzdáleného API.
 * 
 * @module incineratorApi
 */

import { incineratorData } from '@/data/incinerators';
import { Incinerator } from '@/types';
import { logger } from '@/utils/logger';
import { ApiRegion, getApiRegionForBounds, getRegionDataMultiplier } from '@/constants/regions';

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
 * Konfigurace pro simulace API chyb a latence
 */
const API_SIMULATION_CONFIG = {
    // Vypnutí simulovaných chyb pro stabilní testování
    ENABLE_ERROR_SIMULATION: false, // Změněno z true na false
    ERROR_RATE: 0.02, // 2% šance na chybu
    SLOW_REQUEST_RATE: 0.05, // 5% šance na pomalý request
    SLOW_REQUEST_MULTIPLIER: 2, // Kolik krát pomalejší bude pomalý request
};

/**
 * Geografické regiony pro simulaci dynamického načítání
 * Přesunuty do centralizovaného souboru /constants/regions.ts
 */
export type { ApiRegion as Region } from '@/constants/regions';

/**
 * Simuluje API volání s delay a logováním
 */
const simulateApiCall = async <T>(data: T, regionName: string, customDelay?: number): Promise<T> => {
    // Simulace variabilního zatížení serveru
    const baseDelay = customDelay || API_DELAY;
    const variability = Math.random() * 0.4 + 0.8; // 80-120% base delay
    const finalDelay = Math.floor(baseDelay * variability);

    // Simulace občasných pomalých requestů
    if (Math.random() < API_SIMULATION_CONFIG.SLOW_REQUEST_RATE) {
        const slowDelay = finalDelay * API_SIMULATION_CONFIG.SLOW_REQUEST_MULTIPLIER;
        logger.logSlowRequest(slowDelay, finalDelay);
        await new Promise(resolve => setTimeout(resolve, slowDelay));
    } else {
        await new Promise(resolve => setTimeout(resolve, finalDelay));
    }

    // Simulace občasných chyb - pouze pokud je povolena
    if (API_SIMULATION_CONFIG.ENABLE_ERROR_SIMULATION && Math.random() < API_SIMULATION_CONFIG.ERROR_RATE) {
        logger.error('API simulation error triggered');
        throw new Error('Simulovaná chyba API - server dočasně nedostupný');
    }

    return data;
};

/**
 * Určuje region na základě viewport bounds
 */
export const getRegionForBounds = (bounds: MapBounds): ApiRegion | null => {
    return getApiRegionForBounds(bounds);
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
    if (zoom < 12) {
        logger.api(`Local API: Filtering out polygon data for zoom ${zoom} (< 12)`);
        const optimizedData = filtered.map(incinerator => {
            const hasPolygons = incinerator.propertyBoundary || (incinerator.buildings && incinerator.buildings.length > 0);
            if (hasPolygons) {
                logger.debug(`   Optimizing ${incinerator.name}: removing ${incinerator.propertyBoundary ? 'property boundary' : ''}${incinerator.propertyBoundary && incinerator.buildings?.length ? ' + ' : ''}${incinerator.buildings?.length ? `${incinerator.buildings.length} buildings` : ''}`);
            }
            return {
                ...incinerator,
                propertyBoundary: undefined, // Odstraníme polygon areálu
                buildings: [] // Odstraníme budovy
            };
        });
        return optimizedData;
    } else {
        logger.api(`Local API: Including polygon data for zoom ${zoom} (>= 12)`);
        filtered.forEach(incinerator => {
            const hasPolygons = incinerator.propertyBoundary || (incinerator.buildings && incinerator.buildings.length > 0);
            if (hasPolygons) {
                logger.debug(`   Including ${incinerator.name}: ${incinerator.propertyBoundary ? 'property boundary' : ''}${incinerator.propertyBoundary && incinerator.buildings?.length ? ' + ' : ''}${incinerator.buildings?.length ? `${incinerator.buildings.length} buildings` : ''}`);
            } else {
                logger.debug(`   ${incinerator.name}: no polygon data available`);
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
/**
 * Načte spalovny pro daný viewport a zoom úroveň
 */
export const fetchIncineratorsByViewport = async (request: ApiRequest): Promise<ApiResponse> => {
    const { bounds, zoom } = request;
    const region = getRegionForBounds(bounds);

    const regionName = region?.name || 'Neznámá oblast';

    // Logování request
    logger.logApiRequest(regionName, bounds, zoom);
    logger.logRegionDetection(regionName, region !== null);

    try {        // Simulace načítání pouze dat v aktuálním viewport
        let filteredIncinerators = filterIncineratorsByBounds(incineratorData, bounds, zoom);
        const originalCount = filteredIncinerators.length;

        // Simulace různého množství dat podle regionu a zoom úrovně
        const maxResults = getMaxResultsForZoomAndRegion(zoom, region);
        if (filteredIncinerators.length > maxResults) {
            filteredIncinerators = filteredIncinerators.slice(0, maxResults);
        }

        logger.logDataFiltering(originalCount, filteredIncinerators.length, maxResults);

        // Simulace chybějících dat v některých regionech při nízkém zoom
        if (zoom < 8 && !region) {
            logger.error('Nízký zoom mimo hlavní regiony - žádná data dostupná');
            filteredIncinerators = [];
        }

        const clustered = shouldCluster(zoom);
        logger.logClustering(clustered, zoom);

        // Clustering logika zatím není implementována
        // if (clustered && filteredIncinerators.length > 0) {
        //     filteredIncinerators = processClusteredData(filteredIncinerators);
        // }

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
        logger.logApiResponse(result.incinerators.length, result.totalCount, actualTime, regionName);

        return result;

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Neznámá chyba';
        logger.error(errorMessage);
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
const getMaxResultsForZoomAndRegion = (zoom: number, region: ApiRegion | null): number => {
    const baseLimit = getMaxResultsForZoom(zoom);

    const multiplier = getRegionDataMultiplier(region?.name || null);
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

    logger.api('Prefetching data for expanded bounds:', expandedBounds);

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
            logger.cache('Data loaded from cache:', key);
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
        logger.cache('Data cached:', key);
    }

    clear(): void {
        this.cache.clear();
        logger.cache('Cache cleared');
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

/**
 * Funkce pro vývojářské a testovací účely
 */
export const toggleErrorSimulation = (enabled: boolean) => {
    API_SIMULATION_CONFIG.ENABLE_ERROR_SIMULATION = enabled;
    logger.info(`API error simulation ${enabled ? 'enabled' : 'disabled'}`);
};

export const getApiSimulationConfig = () => ({ ...API_SIMULATION_CONFIG });
