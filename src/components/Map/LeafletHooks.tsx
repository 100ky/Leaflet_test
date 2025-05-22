'use client';

import { useState, useEffect } from 'react';
import { Map, LeafletEventHandlerFnMap } from 'leaflet';

// Tento soubor funguje jako most pro React-Leaflet hooky,
// které musí být dynamicky importovány pro správné fungování v Next.js

// React-Leaflet hook modul
interface ReactLeafletModule {
    useMap: () => Map;
    useMapEvents: (events: LeafletEventHandlerFnMap) => Map;
    [key: string]: unknown;
}

let _reactLeafletModule: ReactLeafletModule | null = null;

/**
 * Wrapper pro useMap hook z react-leaflet
 */
export function useMapHook() {
    const [map, setMap] = useState<Map | null>(null);

    useEffect(() => {
        let mounted = true;

        // Pouze pokud modul ještě není načtený
        if (!_reactLeafletModule) {
            import('react-leaflet').then((mod) => {
                if (mounted) {
                    _reactLeafletModule = mod;
                    if (mod.useMap) {
                        try {
                            // Voláme hook z modulu
                            const leafletMap = mod.useMap();
                            setMap(leafletMap);
                        } catch (error) {
                            console.error('Error using useMap hook:', error);
                        }
                    }
                }
            }).catch(error => {
                console.error('Failed to load react-leaflet:', error);
            });
        } else if (_reactLeafletModule.useMap) {
            try {
                // Modul je již načtený, můžeme použít jeho hook
                const leafletMap = _reactLeafletModule.useMap();
                setMap(leafletMap);
            } catch (error) {
                console.error('Error using useMap hook:', error);
            }
        }

        return () => {
            mounted = false;
        };
    }, []);

    return map;
}

/**
 * Wrapper pro useMapEvents hook z react-leaflet
 * @param events Mapa event handlerů
 */
export function useMapEventsHook(events: LeafletEventHandlerFnMap) {
    const [map, setMap] = useState<Map | null>(null);

    useEffect(() => {
        let mounted = true;

        // Pouze pokud modul ještě není načtený
        if (!_reactLeafletModule) {
            import('react-leaflet').then((mod) => {
                if (mounted) {
                    _reactLeafletModule = mod;
                    if (mod.useMapEvents) {
                        try {
                            // Voláme hook z modulu
                            const leafletMap = mod.useMapEvents(events);
                            setMap(leafletMap);
                        } catch (error) {
                            console.error('Error using useMapEvents hook:', error);
                        }
                    }
                }
            }).catch(error => {
                console.error('Failed to load react-leaflet:', error);
            });
        } else if (_reactLeafletModule.useMapEvents) {
            try {
                // Modul je již načtený, můžeme použít jeho hook
                const leafletMap = _reactLeafletModule.useMapEvents(events);
                setMap(leafletMap);
            } catch (error) {
                console.error('Error using useMapEvents hook:', error);
            }
        }

        return () => {
            mounted = false;
        };
    }, [events]);

    return map;
}

// Exportujeme konstantu s výchozím zoomem
export const DEFAULT_ZOOM = 7;
