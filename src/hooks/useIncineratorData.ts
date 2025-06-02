/**
 * useIncineratorData.ts - React hook pro správu dat spaloven
 * Poskytuje funkcionalitu pro dynamické načítání, caching a přepínání mezi API
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Incinerator } from '@/types';
import {
    fetchIncineratorsWithCache,
    prefetchNearbyData,
    MapBounds,
    ApiRequest,
    ApiResponse,
    getRegionForBounds
} from '@/services/incineratorApi';
import { flyToRegion as globalFlyToRegion } from '@/utils/mapRegistry';
import {
    fetchRemoteIncineratorsByViewport,
    testRemoteApiConnection
} from '@/services/remoteApi';

/**
 * Props pro useIncineratorData hook
 */
interface UseIncineratorDataProps {
    initialBounds?: MapBounds;
    initialZoom?: number;
    enablePrefetch?: boolean;
    useRemoteApi?: boolean; // Nová možnost pro přepínání na vzdálené API
}

/**
 * Return type pro useIncineratorData hook
 */
interface UseIncineratorDataReturn {
    incinerators: Incinerator[];
    loading: boolean;
    error: string | null;
    totalCount: number;
    clustered: boolean;
    usingRemoteApi: boolean; // Indikátor, zda se používá vzdálené API
    currentRegion: string; // Aktuální region podle viewport
    updateViewport: (bounds: MapBounds, zoom: number) => void;
    refetch: () => void;
    switchToRemoteApi: () => void; // Funkce pro přepnutí na vzdálené API
    switchToLocalApi: () => void; // Funkce pro přepnutí na lokální API
    flyToRegion: (bounds: MapBounds, zoom: number) => void; // Funkce pro přesun mapy na region
}

/**
 * Hook pro správu dat spaloven podle viewport a zoom úrovně
 */
export const useIncineratorData = ({
    initialBounds,
    initialZoom = 7,
    enablePrefetch = true,
    useRemoteApi = false
}: UseIncineratorDataProps = {}): UseIncineratorDataReturn => {
    const [incinerators, setIncinerators] = useState<Incinerator[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [clustered, setClustered] = useState(false);
    const [usingRemoteApi, setUsingRemoteApi] = useState(useRemoteApi);
    const [currentRegion, setCurrentRegion] = useState<string>('Neznámá oblast');

    // Refs pro uložení aktuálních hodnot    // Refs pro uložení aktuálních hodnot
    const currentBounds = useRef<MapBounds | undefined>(initialBounds);
    const currentZoom = useRef<number>(initialZoom);
    const loadingRef = useRef(false);
    const prefetchTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

    /**
     * Načte data pro aktuální viewport
     */
    const fetchData = useCallback(async (bounds: MapBounds, zoom: number, force = false) => {
        // Prevence duplicitních volání
        if (loadingRef.current && !force) {
            console.log('Request already in progress, skipping...');
            return;
        }

        loadingRef.current = true;
        setLoading(true);
        setError(null);

        try {
            const request: ApiRequest = {
                bounds,
                zoom,
                clustered: zoom < 10
            };

            console.log(`Fetching data for viewport using ${usingRemoteApi ? 'remote' : 'local'} API:`, request);

            let response: ApiResponse;

            if (usingRemoteApi) {
                // Použij vzdálené API
                response = await fetchRemoteIncineratorsByViewport(request);
            } else {
                // Použij lokální API s cache
                response = await fetchIncineratorsWithCache(request);
            }

            setIncinerators(response.incinerators);
            setTotalCount(response.totalCount);
            setClustered(response.clustered);

            console.log(`Loaded ${response.incinerators.length} incinerators`);

            // Prediktivní načítání dat pro sousední oblasti (pouze pro lokální API)
            if (enablePrefetch && !usingRemoteApi) {
                // Debounce prefetch - spustí až po 2 sekundách klidu
                if (prefetchTimeout.current) {
                    clearTimeout(prefetchTimeout.current);
                }

                prefetchTimeout.current = setTimeout(() => {
                    prefetchNearbyData(bounds, zoom).catch(err => {
                        console.warn('Prefetch failed:', err);
                    });
                }, 2000);
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            console.error('Error fetching incinerator data:', err);

            // Pokud vzdálené API selže, automaticky přepni na lokální
            if (usingRemoteApi) {
                console.log('Remote API failed, switching to local data...');
                setUsingRemoteApi(false);
                // Zkus znovu s lokálními daty
                setTimeout(() => fetchData(bounds, zoom, true), 1000);
            }
        } finally {
            setLoading(false);
            loadingRef.current = false;
        }
    }, [enablePrefetch, usingRemoteApi]);

    /**
     * Aktualizuje viewport a načte nová data
     */
    const updateViewport = useCallback((bounds: MapBounds, zoom: number) => {
        // Kontrola, zda se viewport skutečně změnil
        const boundsChanged = !currentBounds.current ||
            Math.abs(currentBounds.current.north - bounds.north) > 0.001 ||
            Math.abs(currentBounds.current.south - bounds.south) > 0.001 ||
            Math.abs(currentBounds.current.east - bounds.east) > 0.001 ||
            Math.abs(currentBounds.current.west - bounds.west) > 0.001;

        const zoomChanged = Math.abs(currentZoom.current - zoom) > 0.5;

        if (boundsChanged || zoomChanged) {
            console.log('Viewport changed:', { bounds, zoom, boundsChanged, zoomChanged });

            currentBounds.current = bounds;
            currentZoom.current = zoom;

            // Detekce aktuálního regionu
            const region = getRegionForBounds(bounds);
            setCurrentRegion(region ? region.name : 'Neznámá oblast');

            fetchData(bounds, zoom);
        }
    }, [fetchData]);    /**
     * Přesune mapu na zadaný region
     */
    const flyToRegion = useCallback((bounds: MapBounds, zoom: number) => {
        console.log('Flying to region via global registry:', bounds, zoom);
        globalFlyToRegion(bounds, zoom);
    }, []);

    /**
     * Znovu načte data pro aktuální viewport
     */
    const refetch = useCallback(() => {
        if (currentBounds.current) {
            fetchData(currentBounds.current, currentZoom.current, true);
        }
    }, [fetchData]);    /**
     * Přepne na vzdálené API
     */
    const switchToRemoteApi = useCallback(async () => {
        console.log('🔄 Switching to remote API...');
        setLoading(true);
        setError(null);

        try {
            // Test připojení k vzdálenému API
            const connected = await testRemoteApiConnection();

            if (connected) {
                console.log('✅ Remote API is accessible, switching...');
                setUsingRemoteApi(true);
                setError(null);

                // Znovu načti data s remote API
                if (currentBounds.current) {
                    console.log('🔄 Fetching data from remote API...');
                    await fetchData(currentBounds.current, currentZoom.current, true);
                }

                console.log('✅ Successfully switched to remote API');
            } else {
                throw new Error('Vzdálené API není dostupné nebo neodpovídá');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Chyba připojení k vzdálenému API';
            console.error('❌ Failed to switch to remote API:', err);
            setError(`Nepodařilo se přepnout na vzdálené API: ${errorMessage}`);
            setUsingRemoteApi(false); // Zůstáváme na lokálním API
        } finally {
            setLoading(false);
        }
    }, [fetchData]);    /**
     * Přepne na lokální API
     */
    const switchToLocalApi = useCallback(() => {
        console.log('🔄 Switching to local API...');
        setLoading(true);
        setUsingRemoteApi(false);
        setError(null);

        // Znovu načti data s lokálním API
        if (currentBounds.current) {
            console.log('🔄 Fetching data from local API...');
            fetchData(currentBounds.current, currentZoom.current, true)
                .then(() => {
                    console.log('✅ Successfully switched to local API');
                })
                .catch(err => {
                    console.error('❌ Error loading local data:', err);
                    setError('Chyba při načítání lokálních dat');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [fetchData]);

    /**
     * Iniciální načtení dat
     */
    useEffect(() => {
        if (initialBounds) {
            fetchData(initialBounds, initialZoom);
        }
    }, [initialBounds, initialZoom, fetchData]);

    /**
     * Cleanup prefetch timeout
     */
    useEffect(() => {
        return () => {
            if (prefetchTimeout.current) {
                clearTimeout(prefetchTimeout.current);
            }
        };
    }, []); return {
        incinerators,
        loading,
        error,
        totalCount,
        clustered,
        usingRemoteApi,
        currentRegion,
        updateViewport,
        refetch,
        switchToRemoteApi,
        switchToLocalApi,
        flyToRegion
    };
};
