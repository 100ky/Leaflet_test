/**
 * Centralizovaná správa mapových instancí
 * 
 * Poskytuje globální registr pro Leaflet mapy v aplikaci:
 * - Registrace a správa mapových instancí
 * - Globální přístup k mapovým operacím (flyTo, zoom, atd.)
 * - Centralizované ovládání z různých komponentů
 * - Memory management a cleanup mapových objektů
 * 
 * Využívá se pro komunikaci mezi komponentami bez prop drilling.
 * 
 * @module mapRegistry
 */

import { Map as LeafletMap } from 'leaflet';
import { logger } from './logger';

/**
 * Registr pro správu mapových instancí
 */

class MapRegistry {
    private mapInstances: Map<string, LeafletMap> = new Map();

    /**
     * Zaregistruje mapovou instanci
     */
    registerMap(id: string, map: LeafletMap) {
        logger.map(`Registering map instance: ${id}`);
        this.mapInstances.set(id, map);
    }

    /**
     * Odregistruje mapovou instanci
     */
    unregisterMap(id: string) {
        logger.map(`Unregistering map instance: ${id}`);
        this.mapInstances.delete(id);
    }

    /**
     * Získá mapovou instanci podle ID
     */
    getMap(id: string): LeafletMap | undefined {
        return this.mapInstances.get(id);
    }

    /**
     * Získá první dostupnou mapovou instanci
     */
    getFirstMap(): LeafletMap | undefined {
        return this.mapInstances.values().next().value;
    }
}

// Singleton instance
export const mapRegistry = new MapRegistry();

// Default map ID pro hlavní mapu
export const DEFAULT_MAP_ID = 'main-map';

/**
 * Helper funkce pro flyTo na hlavní mapě
 */
export const flyToRegion = (bounds: { north: number; south: number; east: number; west: number }, zoom: number) => {
    const map = mapRegistry.getFirstMap();

    if (map) {
        logger.map('Flying to region:', bounds, 'zoom:', zoom);

        // Konverze bounds na Leaflet format
        const leafletBounds = [
            [bounds.south, bounds.west],
            [bounds.north, bounds.east]
        ] as [[number, number], [number, number]];

        map.flyToBounds(leafletBounds, {
            duration: 2,
            maxZoom: zoom,
            padding: [20, 20]
        });
    } else {
        logger.warn('No map instance available for flyTo operation');
    }
};
