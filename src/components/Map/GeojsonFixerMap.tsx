'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { Incinerator, BuildingType } from '@/types';
import L from 'leaflet';
import { getIncineratorIcon } from './mapIcons';

interface GeoJsonFixerMapProps {
    incinerator: Incinerator;
}

// Funkce pro získání stylu polygonu podle typu budovy
const getBuildingStyle = (buildingType: BuildingType) => {
    switch (buildingType) {
        case BuildingType.MainBuilding:
            return { color: '#ff0000', weight: 2, opacity: 0.8, fillOpacity: 0.3, fillColor: '#ff5555' };
        case BuildingType.ChimneyStack:
            return { color: '#555555', weight: 2, opacity: 0.8, fillOpacity: 0.6, fillColor: '#999999' };
        case BuildingType.ProcessingUnit:
            return { color: '#0000ff', weight: 2, opacity: 0.8, fillOpacity: 0.3, fillColor: '#5555ff' };
        case BuildingType.StorageArea:
            return { color: '#00ff00', weight: 2, opacity: 0.8, fillOpacity: 0.3, fillColor: '#55ff55' };
        case BuildingType.WasteBunker:
            return { color: '#ff9900', weight: 2, opacity: 0.8, fillOpacity: 0.3, fillColor: '#ffcc77' };
        case BuildingType.AshStorage:
            return { color: '#996633', weight: 2, opacity: 0.8, fillOpacity: 0.3, fillColor: '#cc9966' };
        default:
            return { color: '#333333', weight: 2, opacity: 0.8, fillOpacity: 0.3, fillColor: '#777777' };
    }
};

// Styl pro celý areál spalovny
const propertyStyle = {
    color: '#2A9D8F',
    weight: 3,
    opacity: 0.7,
    fillOpacity: 0.2,
    fillColor: '#2A9D8F'
};

export default function GeojsonFixerMap({ incinerator }: GeoJsonFixerMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Načítání mapy...</div>;
    }

    // Vytvoříme referenční bod pro střed spalovny (Google Maps souřadnice)
    const referencePoint = {
        'ZEVO Malešice': { lat: 50.079655, lng: 14.5405696 }
    };

    const reference = referencePoint[incinerator.name as keyof typeof referencePoint];
    const zoomLevel = 16;

    // Funkce pro přidání metadat ke GeoJSON objektům
    const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
        if (feature.properties) {
            // Získat koordináty bezpečně podle typu geometrie
            let coordinatesDisplay = '';
            // Funkce pro extrakci koordinát z GeoJSON geometrie
            const getCoordinates = (geometry: GeoJSON.Geometry): string | null => {
                switch (geometry.type) {
                    case 'Point':
                    case 'LineString':
                    case 'Polygon':
                    case 'MultiPoint':
                    case 'MultiLineString':
                    case 'MultiPolygon':
                        // Použijeme typovou aserci s přesnější definicí struktury
                        return JSON.stringify((geometry as { coordinates: unknown }).coordinates);
                    default:
                        return null;
                }
            };

            const coordinates = getCoordinates(feature.geometry);
            if (coordinates) {
                coordinatesDisplay = `<p class="text-xs"><strong>Souřadnice:</strong><br/> ${coordinates}</p>`;
            }

            layer.bindPopup(`
        <div>
          <h3>${feature.properties.name || 'GeoJSON objekt'}</h3>
          <p>${feature.properties.description || 'Bez popisu'}</p>
          ${coordinatesDisplay}
        </div>
      `);
        }
    };

    return (
        <MapContainer
            center={[incinerator.location.lat, incinerator.location.lng]}
            zoom={zoomLevel}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Hlavní značka spalovny */}
            <Marker
                position={[incinerator.location.lat, incinerator.location.lng]}
                icon={getIncineratorIcon(incinerator.operational)}
            >
                <Popup>
                    <div>
                        <h3>{incinerator.name}</h3>
                        <p>{incinerator.description}</p>
                        <p className="text-xs">Souřadnice: {incinerator.location.lat.toFixed(6)}, {incinerator.location.lng.toFixed(6)}</p>
                    </div>
                </Popup>
            </Marker>

            {/* Referenční bod z Google Maps (pokud existuje) */}
            {reference && (
                <Marker
                    position={[reference.lat, reference.lng]}
                    icon={new L.Icon({
                        iconUrl: '/images/marker-nonoperational.png',
                        shadowUrl: '/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    })}
                >
                    <Popup>
                        <div>
                            <h3>{incinerator.name} - Reference (Google Maps)</h3>
                            <p className="text-xs">Souřadnice: {reference.lat.toFixed(6)}, {reference.lng.toFixed(6)}</p>
                        </div>
                    </Popup>
                </Marker>
            )}

            {/* Obrys areálu spalovny */}
            {incinerator.propertyBoundary && (
                <GeoJSON
                    data={{
                        type: 'Feature',
                        properties: {
                            name: `${incinerator.name} - areál`,
                            description: 'Hranice areálu'
                        },
                        geometry: incinerator.propertyBoundary
                    } as GeoJSON.Feature}
                    style={propertyStyle}
                    onEachFeature={onEachFeature}
                />
            )}

            {/* Budovy spalovny */}
            {incinerator.buildings && incinerator.buildings.map((building) => (
                <GeoJSON
                    key={`building-${building.id}`}
                    data={{
                        type: 'Feature',
                        properties: {
                            name: building.name,
                            description: building.description,
                            buildingType: building.type
                        },
                        geometry: building.geometry
                    } as GeoJSON.Feature}
                    style={() => getBuildingStyle(building.type)}
                    onEachFeature={onEachFeature}
                />
            ))}

            {/* Debugovací informace */}
            <div className="leaflet-bottom leaflet-right" style={{ zIndex: 1000, margin: '10px', backgroundColor: 'white', padding: '5px', borderRadius: '5px', opacity: 0.9 }}>
                <div className="text-xs">
                    <strong>Souřadnice:</strong><br />
                    <span className="text-green-600">Zelená značka:</span> Aktuální data<br />
                    {reference && <span className="text-red-600">Červená značka:</span>} {reference && 'Reference (Google Maps)'}
                </div>
            </div>
        </MapContainer>
    );
}
