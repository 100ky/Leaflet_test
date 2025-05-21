'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { incineratorData } from '@/data/incinerators';
import dynamic from 'next/dynamic';
import { Incinerator, Building } from '@/types';
import type { GeoJsonObject } from 'geojson';

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

const GeoJSON = dynamic<React.ComponentProps<typeof import('react-leaflet').GeoJSON>>(
    () => import('react-leaflet').then((mod) => mod.GeoJSON),
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

// Vytvoříme typ, který je alias k Incinerator, abychom předešli varování o prázdném rozhraní
type UpdatedIncinerator = Incinerator;

export default function PolygonSync() {
    const [isMounted, setIsMounted] = useState(false);
    const [selectedIncinerator, setSelectedIncinerator] = useState('ZEVO Malešice');
    const [updatedPolygons, setUpdatedPolygons] = useState<UpdatedIncinerator | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const mapStyle = {
        height: '500px',
        width: '100%',
    };

    const selectedIncineratorData = incineratorData.find(inc => inc.name === selectedIncinerator);

    const handleIncineratorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedIncinerator(e.target.value);
        setUpdatedPolygons(null);
        setShowPreview(false);
    };

    // Funkce pro výpočet offsetu (rozdílu) mezi původními a aktuálními souřadnicemi
    const calculateOffset = (incinerator: Incinerator) => {
        // Středový bod polygonu pozemku
        const propertyCoords = incinerator.propertyBoundary?.coordinates[0];
        if (!propertyCoords || propertyCoords.length === 0) {
            return { lat: 0, lng: 0 };
        }

        // Výpočet středu polygonu
        let sumLng = 0;
        let sumLat = 0;
        propertyCoords.forEach((coord: number[]) => {
            sumLng += coord[0];
            sumLat += coord[1];
        });
        const centerLng = sumLng / propertyCoords.length;
        const centerLat = sumLat / propertyCoords.length;

        // Výpočet offsetu
        return {
            lat: incinerator.location.lat - centerLat,
            lng: incinerator.location.lng - centerLng
        };
    };

    // Funkce pro aktualizaci souřadnic polygonu pozemku a budov
    const updatePolygonCoordinates = () => {
        if (!selectedIncineratorData) return;

        const offset = calculateOffset(selectedIncineratorData);

        // Vytvoření kopie objektu spalovny
        const updatedIncinerator = JSON.parse(JSON.stringify(selectedIncineratorData));

        // Posun polygonu pozemku
        if (updatedIncinerator.propertyBoundary) {
            updatedIncinerator.propertyBoundary.coordinates[0] = updatedIncinerator.propertyBoundary.coordinates[0].map(
                (coord: number[]) => [coord[0] + offset.lng, coord[1] + offset.lat]
            );
        }

        // Posun polygonů budov
        if (updatedIncinerator.buildings) {
            updatedIncinerator.buildings = updatedIncinerator.buildings.map((building: Building) => {
                if (building.geometry && building.geometry.coordinates && building.geometry.coordinates[0]) {
                    building.geometry.coordinates[0] = building.geometry.coordinates[0].map(
                        (coord: number[]) => [coord[0] + offset.lng, coord[1] + offset.lat]
                    );
                }
                return building;
            });
        }

        setUpdatedPolygons(updatedIncinerator);
        setShowPreview(true);
    };

    // Generuje kód pro aktualizaci polygonů v souboru incinerators.ts
    const generateUpdateCode = () => {
        if (!updatedPolygons || !updatedPolygons.propertyBoundary) return '';

        let code = `// Aktualizované polygony pro ${updatedPolygons.name}\n\n`;

        // Kód pro vlastnost propertyBoundary
        code += `propertyBoundary: {
  type: 'Polygon',
  coordinates: [[
${updatedPolygons.propertyBoundary.coordinates[0].map((coord: number[]) =>
            `    [${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}]`).join(',\n')}
  ]]
},\n\n`;

        // Kód pro budovy
        if (updatedPolygons.buildings && updatedPolygons.buildings.length > 0) {
            code += `buildings: [\n`; updatedPolygons.buildings.forEach((building: Building, index: number) => {
                code += `  // ${building.name}\n`;
                code += `  {\n`;
                code += `    ..., // Zachovat původní vlastnosti budovy\n`;
                code += `    geometry: {\n`;
                code += `      type: 'Polygon',\n`;
                code += `      coordinates: [[\n`;
                if (building.geometry && building.geometry.coordinates && building.geometry.coordinates[0]) {
                    code += building.geometry.coordinates[0].map((coord: number[]) =>
                        `        [${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}]`).join(',\n');
                }
                code += `\n      ]]\n`;
                code += `    },\n`;
                code += `  }${index < (updatedPolygons.buildings?.length || 0) - 1 ? ',' : ''}\n`;
            });
            code += `],`;
        }

        return code;
    };

    if (!isMounted) {
        return <div>Načítání...</div>;
    }

    if (!selectedIncineratorData) {
        return <div>Vybraná spalovna nebyla nalezena.</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Synchronizace polygonů s umístěním spalovny</h1>

            <div className="mb-4">
                <Link href="/" className="text-blue-500 hover:underline">
                    ← Zpět na hlavní stránku
                </Link>
            </div>

            <div className="mb-4 bg-gray-100 p-4 rounded-lg">
                <label htmlFor="incineratorSelect" className="block text-sm font-medium text-gray-700 mb-2">
                    Vyberte spalovnu pro synchronizaci polygonů:
                </label>
                <select
                    id="incineratorSelect"
                    value={selectedIncinerator}
                    onChange={handleIncineratorChange}
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm mb-4"
                >
                    {incineratorData.map(inc => (
                        <option key={inc.id} value={inc.name}>{inc.name}</option>
                    ))}
                </select>

                <button
                    onClick={updatePolygonCoordinates}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Synchronizovat polygony
                </button>
            </div>

            {showPreview && (<>
                <h2 className="text-xl font-semibold mb-2">Náhled aktualizovaných polygonů</h2>
                <div className="mb-4">
                    <LeafletCSS />
                    <MapContainer
                        center={[selectedIncineratorData.location.lat, selectedIncineratorData.location.lng]}
                        zoom={16}
                        style={mapStyle}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Marker spalovny */}
                        <Marker position={[selectedIncineratorData.location.lat, selectedIncineratorData.location.lng]}>
                            <Popup>
                                <div>
                                    <h3>{selectedIncineratorData.name}</h3>
                                    <p>Aktuální umístění</p>
                                </div>
                            </Popup>
                        </Marker>                            {/* Původní polygon pozemku */}
                        {selectedIncineratorData.propertyBoundary && (
                            <GeoJSON
                                data={selectedIncineratorData.propertyBoundary as unknown as GeoJsonObject}
                                style={{
                                    color: '#ff0000',
                                    weight: 2,
                                    opacity: 0.7,
                                    fillOpacity: 0.2,
                                    fillColor: '#ff0000'
                                }}
                            >
                                <Popup>
                                    <div>
                                        <h3>Původní polygon pozemku</h3>
                                    </div>
                                </Popup>
                            </GeoJSON>
                        )}

                        {/* Aktualizovaný polygon pozemku */}
                        {updatedPolygons && updatedPolygons.propertyBoundary && (
                            <GeoJSON
                                data={updatedPolygons.propertyBoundary as unknown as GeoJsonObject}
                                style={{
                                    color: '#00ff00',
                                    weight: 2,
                                    opacity: 0.7,
                                    fillOpacity: 0.2,
                                    fillColor: '#00ff00'
                                }}
                            >
                                <Popup>
                                    <div>
                                        <h3>Aktualizovaný polygon pozemku</h3>
                                    </div>
                                </Popup>
                            </GeoJSON>
                        )}                            {/* Původní polygony budov */}
                        {selectedIncineratorData.buildings && selectedIncineratorData.buildings.map((building: Building) => (
                            <GeoJSON
                                key={`original-${building.id}`}
                                data={building.geometry as unknown as GeoJsonObject}
                                style={{
                                    color: '#ff6600',
                                    weight: 2,
                                    opacity: 0.7,
                                    fillOpacity: 0.3,
                                    fillColor: '#ff6600'
                                }}
                            >
                                <Popup>
                                    <div>
                                        <h3>Původní budova: {building.name}</h3>
                                    </div>
                                </Popup>
                            </GeoJSON>
                        ))}

                        {/* Aktualizované polygony budov */}
                        {updatedPolygons && updatedPolygons.buildings && updatedPolygons.buildings.map((building: Building) => (
                            <GeoJSON
                                key={`updated-${building.id}`}
                                data={building.geometry as unknown as GeoJsonObject}
                                style={{
                                    color: '#00cc00',
                                    weight: 2,
                                    opacity: 0.7,
                                    fillOpacity: 0.3,
                                    fillColor: '#00cc00'
                                }}
                            >
                                <Popup>
                                    <div>
                                        <h3>Aktualizovaná budova: {building.name}</h3>
                                    </div>
                                </Popup>
                            </GeoJSON>
                        ))}
                    </MapContainer>
                </div>

                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Kód pro aktualizaci</h2>
                    <div className="bg-gray-900 text-white p-4 rounded-lg overflow-auto max-h-96">
                        <pre>{generateUpdateCode()}</pre>
                    </div>
                </div>
            </>
            )}

            <div className="mt-4 bg-blue-100 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Jak používat nástroj pro synchronizaci</h2>                <ol className="list-decimal list-inside">
                    <li>Vyberte spalovnu, kterou chcete aktualizovat</li>
                    <li>Klikněte na tlačítko &quot;Synchronizovat polygony&quot;</li>
                    <li>Prohlédněte si náhled (červené = původní, zelené = aktualizované)</li>
                    <li>Zkopírujte vygenerovaný kód</li>
                    <li>Aktualizujte soubor <code>incinerators.ts</code> s novými souřadnicemi</li>
                </ol>
                <p className="mt-2 text-sm text-gray-700">
                    Tento nástroj automaticky přizpůsobí polygony pozemků a budov tak, aby odpovídaly aktuální poloze značky spalovny.
                </p>
            </div>
        </div>
    );
}
