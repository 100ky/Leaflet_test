'use client';

import { useEffect, useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  useMapEvents,
  GeoJSON,
  useMap
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { Incinerator, BuildingType } from '@/types';
import { getIncineratorIcon } from './mapIcons';

const mapStyle = {
  height: '600px',
  width: '100%',
};

const DEFAULT_ZOOM = 7;

interface MapProps {
  incinerators: Incinerator[];
}

// Komponenta pro sledování úrovně přiblížení
function ZoomLevelDetector({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    }
  });

  useEffect(() => {
    // Nastavení výchozího zoomu při prvním načtení
    onZoomChange(map.getZoom());
  }, [map, onZoomChange]);

  return null;
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

// Komponenta pro resetování zoomu
function ResetZoomControl({ defaultZoom }: { defaultZoom: number }) {
  const map = useMap();
  
  const handleResetZoom = () => {
    map.setZoom(defaultZoom);
  };
  
  return (
    <div className="leaflet-top leaflet-left" style={{ marginTop: '80px' }}>
      <div className="leaflet-control leaflet-bar">
        <button 
          onClick={handleResetZoom}
          className="reset-zoom-button"
          title="Obnovit výchozí přiblížení"
          aria-label="Obnovit výchozí přiblížení"
          style={{
            width: '30px',
            height: '30px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
          }}
        >
          ⟲
        </button>
      </div>
    </div>
  );
}

/**
 * Komponenta Map zobrazující interaktivní mapu spaloven
 */
const Map = ({ incinerators }: MapProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(DEFAULT_ZOOM); // Výchozí hodnota zoomu
  
  // Prahová hodnota pro přepínání mezi režimy zobrazení (property/buildings)
  const DETAIL_ZOOM_THRESHOLD = 12;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const calculateMapCenter = () => {
    if (!incinerators || incinerators.length === 0) {
      return [50.07, 14.43];
    }

    const sumLat = incinerators.reduce((sum, inc) => sum + inc.location.lat, 0);
    const sumLng = incinerators.reduce((sum, inc) => sum + inc.location.lng, 0);
    
    return [sumLat / incinerators.length, sumLng / incinerators.length];
  };

  const mapCenter = calculateMapCenter();

  if (!isMounted) {
    return <div style={mapStyle}></div>;
  }

  const isPlannedIncinerator = (incinerator: Incinerator): boolean => {
    const currentYear = new Date().getFullYear();
    return !incinerator.operational && incinerator.yearEstablished !== undefined &&
           incinerator.yearEstablished > currentYear;
  };

  return (
    <div className="map-container relative">
      <MapContainer 
        center={[mapCenter[0], mapCenter[1]]}
        zoom={DEFAULT_ZOOM}
        style={mapStyle}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Komponenta pro sledování úrovně přiblížení */}
        <ZoomLevelDetector onZoomChange={setCurrentZoom} />
        
        {/* Komponenta pro resetovací tlačítko */}
        <ResetZoomControl defaultZoom={DEFAULT_ZOOM} />
        
        {/* Obrysy pozemků při nižší úrovni přiblížení */}
        {currentZoom < DETAIL_ZOOM_THRESHOLD && incinerators.map((incinerator) => {
          if (incinerator.propertyBoundary) {
            return (
              <GeoJSON 
                key={`property-${incinerator.id}`}
                data={incinerator.propertyBoundary as unknown as GeoJSON.FeatureCollection}
                style={propertyStyle}
              >
                <Popup>
                  <div>
                    <h3>{incinerator.name} - areál</h3>
                    <p>{incinerator.description}</p>
                    <p><strong>Pro zobrazení jednotlivých budov přibližte mapu</strong></p>
                  </div>
                </Popup>
              </GeoJSON>
            );
          }
          return null;
        })}
        
        {/* Obrysy jednotlivých budov při vyšší úrovni přiblížení */}
        {currentZoom >= DETAIL_ZOOM_THRESHOLD && incinerators.map((incinerator) => {
          if (incinerator.buildings && incinerator.buildings.length > 0) {
            return incinerator.buildings.map((building) => (
              <GeoJSON
                key={`building-${building.id}`}
                data={building.geometry as GeoJSON.Geometry}
                style={() => getBuildingStyle(building.type)}
              >
                <Popup>
                  <div>
                    <h3>{building.name}</h3>
                    <p>{building.description}</p>
                    {building.details && (
                      <>
                        {building.details.yearBuilt && (
                          <p>Rok výstavby: {building.details.yearBuilt}</p>
                        )}
                        {building.details.areaInSqMeters && (
                          <p>Rozloha: {building.details.areaInSqMeters} m²</p>
                        )}
                        {building.details.function && (
                          <p>Funkce: {building.details.function}</p>
                        )}
                      </>
                    )}
                    <p><em>Součást: {incinerator.name}</em></p>
                  </div>
                </Popup>
              </GeoJSON>
            ));
          }
          return null;
        })}
        
        {/* Standardní značky spaloven */}
        {incinerators.map((incinerator) => {
          const isPlanned = isPlannedIncinerator(incinerator);
          const icon = getIncineratorIcon(incinerator.operational, isPlanned);
          
          return (
            <Marker 
              key={incinerator.id}
              position={[incinerator.location.lat, incinerator.location.lng]}
              icon={icon}
            >
              <Popup>
                <div>
                  <h3>{incinerator.name}</h3>
                  <p>{incinerator.description}</p>
                  <p>Kapacita: {incinerator.capacity} tun/rok</p>
                  <p>Stav: {
                    incinerator.operational 
                      ? 'V provozu' 
                      : (isPlanned ? 'Plánovaná výstavba' : 'Mimo provoz')
                  }</p>
                  <p>Založeno: {incinerator.yearEstablished || 'Neznámo'}</p>
                  {currentZoom < DETAIL_ZOOM_THRESHOLD && incinerator.buildings && (
                    <p><strong>Pro zobrazení budov přibližte mapu</strong></p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Ukazatel aktuálního zoomu */}
      <div className="absolute bottom-2 left-2 bg-white bg-opacity-70 px-2 py-1 rounded text-xs">
        Zoom: {currentZoom}
      </div>
    </div>
  );
};

export default Map;""