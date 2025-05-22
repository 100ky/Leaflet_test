'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LeafletCSS, DEFAULT_MAP_STYLE } from '@/utils/map-helpers';
import L from 'leaflet';

// Dynamické importy React-Leaflet komponent
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);

const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);

const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);

const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

const GeoJSON = dynamic(
    () => import('react-leaflet').then((mod) => mod.GeoJSON),
    { ssr: false }
);

// Definujeme konstanty
const DEFAULT_ZOOM = 7;

/**
 * Využijeme useLeafletIcon hook pro získání instance ikony
 */
export function useLeafletIcon(iconUrl: string) {
    const [icon, setIcon] = useState<L.Icon | null>(null);

    useEffect(() => {
        async function createIcon() {
            try {
                const L = await import('leaflet');
                const customIcon = new L.Icon({
                    iconUrl,
                    shadowUrl: '/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });
                setIcon(customIcon);
            } catch (error) {
                console.error('Error creating Leaflet icon:', error);
            }
        }
        createIcon();
    }, [iconUrl]);

    return icon;
}

// Export komponent a konstant
export {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    GeoJSON,
    LeafletCSS,
    DEFAULT_MAP_STYLE,
    DEFAULT_ZOOM
};
