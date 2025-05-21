'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamický import Leaflet komponent - řeší problém s window is not defined při SSR
const MapContainer = dynamic<React.ComponentProps<typeof import('react-leaflet').MapContainer>>(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);

const TileLayer = dynamic<React.ComponentProps<typeof import('react-leaflet').TileLayer>>(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);

// Správná definice typu pro Marker komponentu
const Marker = dynamic<React.ComponentProps<typeof import('react-leaflet').Marker>>(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);

const Popup = dynamic<React.ComponentProps<typeof import('react-leaflet').Popup>>(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

// Leaflet CSS se importuje pouze na klientu
const LeafletCSS = () => {
    useEffect(() => {
        // Importy CSS a komponent pouze na klientské straně
        // Použijeme try/catch pro případ, že by import selhal
        try {
            // @ts-expect-error: Importujeme CSS soubor, který nemá deklarace typů
            import('leaflet/dist/leaflet.css');
            // @ts-expect-error: Importujeme CSS soubor, který nemá deklarace typů
            import('leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css');
            // @ts-expect-error: Importujeme JS modul bez deklarací typů
            import('leaflet-defaulticon-compatibility');
        } catch (e) {
            console.error('Chyba při importu CSS:', e);
        }
    }, []);
    return null;
};

interface IncineratorLocationMap {
    activeIncinerator: {
        name: string;
        currentLocation: { lat: number; lng: number };
        referenceLocation: { lat: number; lng: number };
    } | null;
}

export default function IncineratorMap({ activeIncinerator }: IncineratorLocationMap) {
    // Explicitně deklarujeme typ ikony jako Leaflet Icon
    const [icon, setIcon] = useState<import('leaflet').Icon | null>(null);
    const mapStyle = {
        height: '500px',
        width: '100%',
    }; useEffect(() => {
        // Inicializace ikony po načtení komponent na klientské straně
        const initIcon = async () => {
            try {
                const L = await import('leaflet');
                const customIcon = new L.Icon({
                    iconUrl: '/images/marker-nonoperational.png',
                    shadowUrl: '/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });
                setIcon(customIcon);
            } catch (error) {
                console.error('Chyba při inicializaci ikony:', error);
            }
        };

        initIcon();
    }, []);

    if (!activeIncinerator) {
        return <div style={mapStyle} className="bg-gray-100 flex items-center justify-center text-gray-500">
            Vyberte spalovnu k zobrazení na mapě
        </div>;
    }

    return (
        <div>
            <LeafletCSS />
            <h2 className="text-xl font-semibold mb-2">
                Mapa pro {activeIncinerator.name}
            </h2>
            <p className="mb-2">
                Zelená značka = aktuální data, Červená značka = referenční data
            </p>
            <MapContainer
                center={[
                    activeIncinerator.currentLocation.lat,
                    activeIncinerator.currentLocation.lng
                ]}
                zoom={15}
                style={mapStyle}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />                {/* Značka pro aktuální data */}
                <Marker
                    position={[
                        activeIncinerator.currentLocation.lat,
                        activeIncinerator.currentLocation.lng
                    ]}
                >
                    <Popup>
                        <div>
                            <h3>{activeIncinerator.name} - Aktuální data</h3>
                            <p>Lat: {activeIncinerator.currentLocation.lat}</p>
                            <p>Lng: {activeIncinerator.currentLocation.lng}</p>
                        </div>
                    </Popup>
                </Marker>                {/* Značka pro referenční data */}
                {icon && (
                    <Marker
                        position={[
                            activeIncinerator.referenceLocation.lat,
                            activeIncinerator.referenceLocation.lng
                        ]}
                        icon={icon}
                    >
                        <Popup>
                            <div>
                                <h3>{activeIncinerator.name} - Referenční data</h3>
                                <p>Lat: {activeIncinerator.referenceLocation.lat}</p>
                                <p>Lng: {activeIncinerator.referenceLocation.lng}</p>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}
