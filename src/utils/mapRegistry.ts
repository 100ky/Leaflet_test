/**
 * mapRegistry.ts - Centralizovaná správa mapových instancí
 * Umožňuje globální přístup k mapovým objektům napříč aplikací
 * Používá se pro flyToRegion a další operace vyžadující přímý přístup k mapě
 */

import { Map as LeafletMap } from 'leaflet';

/**
 * Registr pro správu mapových instancí
 */

class MapRegistry {
    private mapInstances: Map<string, LeafletMap> = new Map();

    /**
     * Zaregistruje mapovou instanci
     */
    registerMap(id: string, map: LeafletMap) {
        console.log(`Registering map instance: ${id}`);
        this.mapInstances.set(id, map);
    }

    /**
     * Odregistruje mapovou instanci
     */
    unregisterMap(id: string) {
        console.log(`Unregistering map instance: ${id}`);
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

    /**
     * Zkontroluje, zda je mapová instance zaregistrována
     */
    hasMap(id: string): boolean {
        return this.mapInstances.has(id);
    }

    /**
     * Provede akci na všech registrovaných mapách
     */
    executeOnAllMaps(action: (map: LeafletMap) => void) {
        this.mapInstances.forEach(action);
    }

    /**
     * Získá počet registrovaných map
     */
    getMapCount(): number {
        return this.mapInstances.size;
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
        console.log('Flying to region:', bounds, 'zoom:', zoom);

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
        console.warn('No map instance available for flyTo operation');
    }
};
