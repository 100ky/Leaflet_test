'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { incineratorData } from '@/data/incinerators';

// Dynamický import Leaflet komponent - řeší problém s window is not defined při SSR
const MapContainer = dynamic<React.ComponentProps<typeof import('react-leaflet').MapContainer>>(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);

const TileLayer = dynamic<React.ComponentProps<typeof import('react-leaflet').TileLayer>>(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);

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

export default function VerifyCoordinates() {
    const [isMounted, setIsMounted] = useState(false);
    const [selectedIncinerator, setSelectedIncinerator] = useState('ZEVO Malešice');
    const [icon, setIcon] = useState<import('leaflet').Icon | null>(null);

    useEffect(() => {
        setIsMounted(true);

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

    const mapStyle = {
        height: '600px',
        width: '100%',
    };

    // Funkce pro měření vzdálenosti mezi dvěma body v metrech
    const calculateDistance = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ) => {
        const R = 6371e3; // Poloměr Země v metrech
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return Math.round(distance);
    };    // Známé souřadnice z Google Maps jako reference
    const referenceCoordinates: Record<string, { lat: number; lng: number }> = {
        'ZEVO Malešice': { lat: 50.079655, lng: 14.5405696 },
        'SAKO Brno': { lat: 49.1891, lng: 16.6563 },
        'TERMIZO Liberec': { lat: 50.7626, lng: 15.0562 },
        'ZEVO Chotíkov': { lat: 49.7973, lng: 13.2877 },
        'Plánovaná spalovna Ostrava': { lat: 49.8283, lng: 18.2652 },
        'ZEVO Plzeň': { lat: 49.7572, lng: 13.3635 },
        'ECOREC Martin': { lat: 49.0662, lng: 18.9272 }
    }; if (!isMounted) {
        return <div style={mapStyle}>Načítání mapy...</div>;
    }

    // Najdi vybranou spalovnu v datech
    const selectedIncineratorData = incineratorData.find(inc => inc.name === selectedIncinerator);
    if (!selectedIncineratorData) {
        return <div>Vybraná spalovna nebyla nalezena v datech.</div>;
    }

    const reference = referenceCoordinates[selectedIncinerator];
    if (!reference) {
        return <div>Pro vybranou spalovnu nejsou k dispozici referenční souřadnice.</div>;
    }

    const handleIncineratorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedIncinerator(e.target.value);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Ověření souřadnic spalovny</h1>

            <div className="mb-4">
                <Link href="/" className="text-blue-500 hover:underline">
                    ← Zpět na hlavní stránku
                </Link>
            </div>

            <div className="mb-4 bg-gray-100 p-4 rounded-lg">
                <label htmlFor="incineratorSelect" className="block text-sm font-medium text-gray-700 mb-2">
                    Vyberte spalovnu pro ověření:
                </label>
                <select
                    id="incineratorSelect"
                    value={selectedIncinerator}
                    onChange={handleIncineratorChange}
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                >
                    {Object.keys(referenceCoordinates).map(name => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <h2 className="text-xl font-semibold">{selectedIncinerator} - Porovnání souřadnic</h2>                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-gray-100 p-4 rounded-lg">
                    <div>
                        <h3 className="font-bold">Aktuální data</h3>
                        <p>Lat: {selectedIncineratorData.location.lat}</p>
                        <p>Lng: {selectedIncineratorData.location.lng}</p>
                    </div>
                    <div>
                        <h3 className="font-bold">Referenční data (Google Maps)</h3>
                        <p>Lat: {reference.lat}</p>
                        <p>Lng: {reference.lng}</p>
                    </div>
                </div>

                <div className="mb-4">
                    <h3 className="font-bold">Analýza:</h3>
                    <p>
                        Vzdálenost mezi body: {' '}
                        <span className="font-bold">
                            {calculateDistance(
                                selectedIncineratorData.location.lat,
                                selectedIncineratorData.location.lng,
                                reference.lat,
                                reference.lng
                            )}{' '}
                            metrů
                        </span>
                    </p>
                    <p className="mt-2">
                        {Math.abs(selectedIncineratorData.location.lat - reference.lat) < 0.0001 &&
                            Math.abs(selectedIncineratorData.location.lng - reference.lng) < 0.0001
                            ? "✅ Souřadnice odpovídají referenčním datům (rozdíl menší než 10 metrů)."
                            : "❌ Souřadnice NEODPOVÍDAJÍ referenčním datům."}
                    </p>
                </div>            </div>

            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Mapa se značkami</h2>
                <p className="mb-4">Zelená značka = aktuální data, Červená značka = referenční data</p>
                <LeafletCSS />
                <MapContainer
                    center={[selectedIncineratorData.location.lat, selectedIncineratorData.location.lng]}
                    zoom={15}
                    style={mapStyle}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Značka pro aktuální data */}
                    <Marker position={[selectedIncineratorData.location.lat, selectedIncineratorData.location.lng]}>
                        <Popup>
                            <div>
                                <h3>{selectedIncinerator} - Aktuální data</h3>
                                <p>Lat: {selectedIncineratorData.location.lat}</p>
                                <p>Lng: {selectedIncineratorData.location.lng}</p>
                            </div>
                        </Popup>
                    </Marker>                    {/* Značka pro referenční data */}
                    {icon && (
                        <Marker
                            position={[reference.lat, reference.lng]}
                            icon={icon}
                        >
                            <Popup>
                                <div>
                                    <h3>{selectedIncinerator} - Reference (Google Maps)</h3>
                                    <p>Lat: {reference.lat}</p>
                                    <p>Lng: {reference.lng}</p>
                                </div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>

            <div className="mt-4 bg-blue-100 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Řešení problémů:</h2>
                <ul className="list-disc list-inside">
                    <li>Pokud se markery zobrazují na stejném místě, ale na špatné pozici, zkontrolujte, zda jsou souřadnice správně aktualizovány v souboru <code>incinerators.ts</code>.</li>
                    <li>Pokud se markery nezobrazují na stejné pozici, možná byla aktualizována jen jedna část dat.</li>
                    <li>Vždy se ujistěte, že souřadnice v souboru jsou správné: zeměpisná šířka (latitude) je první, zeměpisná délka (longitude) je druhá.</li>
                    <li>Při aktualizaci polygonů nezapomeňte, že formát GeoJSON má pořadí [longitude, latitude].</li>
                </ul>
            </div>
        </div>
    );
}
