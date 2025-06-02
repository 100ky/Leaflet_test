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

// Zablokování inicializace vyhledávacího panelu prohlížeče v mapě
// @see https://github.com/Leaflet/Leaflet/issues/7255
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import './Map.css';
import { Incinerator, BuildingType } from '@/types';
import { getIncineratorIcon } from './mapIcons';
import { useIncineratorDataContext } from '@/contexts/IncineratorDataContext';
import { MapBounds } from '@/services/incineratorApi';
import { mapRegistry, DEFAULT_MAP_ID } from '@/utils/mapRegistry';
import L from 'leaflet';

const mapStyle = {
  height: '600px',
  width: '100%',
};

const DEFAULT_ZOOM = 7.5;

interface MapProps {
  // Prop incinerators je nyní volitelný, protože se načítají dynamicky
  incinerators?: Incinerator[];
}

/**
 * Komponenta pro správu reference mapy a propojení s contextem
 */
function MapRefManager() {
  const map = useMap();

  useEffect(() => {
    if (map) {
      // Registrace mapy v globálním registru
      mapRegistry.registerMap(DEFAULT_MAP_ID, map);
      console.log('Map registered in global registry');
    }

    // Cleanup při unmount
    return () => {
      mapRegistry.unregisterMap(DEFAULT_MAP_ID);
      console.log('Map unregistered from global registry');
    };
  }, [map]);

  return null;
}

/**
 * Komponenta pro sledování změn mapy a načítání dat
 */
function MapDataLoader({
  onViewportChange
}: {
  onViewportChange: (bounds: MapBounds, zoom: number) => void
}) {
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      const zoom = map.getZoom();

      const mapBounds: MapBounds = {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      };

      onViewportChange(mapBounds, zoom);
    },
    zoomend: () => {
      const bounds = map.getBounds();
      const zoom = map.getZoom();

      const mapBounds: MapBounds = {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      };

      onViewportChange(mapBounds, zoom);
    }
  });

  // Iniciální načtení dat po načtení mapy
  useEffect(() => {
    const bounds = map.getBounds();
    const zoom = map.getZoom();

    const mapBounds: MapBounds = {
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest()
    };

    onViewportChange(mapBounds, zoom);
  }, [map, onViewportChange]);
  return null;
}

/**
 * Komponenta pro sledování zoom úrovně
 */
function ZoomTracker({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    }
  });

  useEffect(() => {
    onZoomChange(map.getZoom());
  }, [map, onZoomChange]);

  return null;
}

/**
 * Vrací styl polygonu podle typu budovy spalovny
 */
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
  color: '#ff0000',
  weight: 4,
  opacity: 1,
  fillOpacity: 0.5,
  fillColor: '#ff0000'
};

/**
 * Komponenta pro reset zoomu mapy na výchozí pohled
 */
function ResetZoomControl({ defaultZoom }: { defaultZoom: number }) {
  const map = useMap();

  const handleResetZoom = () => {
    // Nastavení pohledu na celou ČR
    map.setView([49.8, 15.5], defaultZoom, { animate: true });
  };

  return (
    <div className="leaflet-top leaflet-left" style={{ marginTop: '80px' }}>
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={handleResetZoom}
          className="reset-zoom-button"
          title="Zobrazit celou ČR"
          aria-label="Zobrazit celou ČR"
        >
          ⟲
        </button>
      </div>
    </div>
  );
}

// Pomocná komponenta pro Marker s podporou dvojkliku
function MarkerWithDoubleClick({ incinerator, icon, children }: { incinerator: Incinerator, icon: L.Icon, children: React.ReactNode }) {
  const map = useMap();

  // Handler pro dvojklik
  const handleDoubleClick = () => {
    map.flyTo([incinerator.location.lat, incinerator.location.lng], 15, { animate: true, duration: 1.5 });
  };

  return (
    <Marker
      position={[incinerator.location.lat, incinerator.location.lng]}
      icon={icon}
      eventHandlers={{
        dblclick: handleDoubleClick,
      }}
    >
      {children}
    </Marker>
  );
}

// Komponenta pro pop-up s aktuálním zoom
function IncineratorPopup({ incinerator, usingRemoteApi }: { incinerator: Incinerator, usingRemoteApi: boolean }) {
  const map = useMap();
  const [currentZoom, setCurrentZoom] = useState(map.getZoom());
  const DETAIL_ZOOM_THRESHOLD = 12;
  // Sledování změn zoomu
  useMapEvents({
    zoomend: () => {
      setCurrentZoom(map.getZoom());
    }
  }); useEffect(() => {
    setCurrentZoom(map.getZoom());
  }, [map]);

  const isPlannedIncinerator = (incinerator: Incinerator): boolean => {
    const currentYear = new Date().getFullYear();
    return !incinerator.operational && incinerator.yearEstablished !== undefined &&
      incinerator.yearEstablished > currentYear;
  };

  const isPlanned = isPlannedIncinerator(incinerator);
  return (
    <Popup maxWidth={350} minWidth={250}>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{incinerator.name}</h3>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>{incinerator.description}</p>
        <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Kapacita:</strong> {incinerator.capacity} tun/rok</p>
        <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Stav:</strong> {
          incinerator.operational
            ? 'V provozu'
            : (isPlanned ? 'Plánovaná výstavba' : 'Mimo provoz')
        }</p>
        <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Založeno:</strong> {incinerator.yearEstablished || 'Neznámo'}</p>        {/* Zobrazení oficiálních informací */}
        {!usingRemoteApi && incinerator.officialInfo && (
          <div style={{
            marginTop: '10px',
            borderTop: '1px solid #eee',
            paddingTop: '10px'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#333' }}>Oficiální informace:</h4>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>
              <em>Aktuální zoom: {currentZoom.toFixed(1)} (detail od {DETAIL_ZOOM_THRESHOLD})</em>
            </div>
            {currentZoom >= DETAIL_ZOOM_THRESHOLD ? (
              // Detailní zobrazení s kompaktním stylingem
              <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
                <p style={{ margin: '4px 0' }}><strong>Provozovatel:</strong> {incinerator.officialInfo.operator}</p>
                <p style={{ margin: '4px 0' }}><strong>Vlastník:</strong> {incinerator.officialInfo.owner}</p>
                <p style={{ margin: '4px 0' }}><strong>Web:</strong> <a href={incinerator.officialInfo.website} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>Odkaz</a></p>
                <p style={{ margin: '4px 0' }}><strong>Telefon:</strong> {incinerator.officialInfo.phone}</p>
                <p style={{ margin: '4px 0' }}><strong>Email:</strong> <span style={{ wordBreak: 'break-all' }}>{incinerator.officialInfo.email}</span></p>
                <p style={{ margin: '4px 0' }}><strong>Technologie:</strong> {incinerator.officialInfo.technology}</p>
                <p style={{ margin: '4px 0' }}><strong>Počet linek:</strong> {incinerator.officialInfo.numberOfLines}</p>
                <p style={{ margin: '4px 0' }}><strong>Max. kapacita/linku:</strong> {incinerator.officialInfo.maxCapacityPerLine} t/rok</p>
                <p style={{ margin: '4px 0' }}><strong>Elektrický výkon:</strong> {incinerator.officialInfo.electricalPowerMW} MW</p>
                <p style={{ margin: '4px 0' }}><strong>Tepelný výkon:</strong> {incinerator.officialInfo.thermalPowerMW} MW</p>
                <p style={{ margin: '4px 0' }}><strong>Produkce páry:</strong> {incinerator.officialInfo.steamProductionTh} t/h</p>

                {incinerator.officialInfo.emissionLimits && (
                  <div style={{ margin: '8px 0' }}>
                    <p style={{ margin: '4px 0' }}><strong>Emisní limity (mg/m³):</strong></p>
                    <ul style={{ margin: '4px 0 4px 20px', padding: 0, fontSize: '12px' }}>
                      <li>CO: {incinerator.officialInfo.emissionLimits.CO}</li>
                      <li>NOx: {incinerator.officialInfo.emissionLimits.NOx}</li>
                      <li>SO2: {incinerator.officialInfo.emissionLimits.SO2}</li>
                      <li>Prach: {incinerator.officialInfo.emissionLimits.dust}</li>
                      <li>Dioxiny (ng/m³): {incinerator.officialInfo.emissionLimits.dioxins}</li>
                    </ul>
                  </div>
                )}

                {incinerator.officialInfo.certifications && incinerator.officialInfo.certifications.length > 0 && (
                  <p style={{ margin: '4px 0' }}><strong>Certifikace:</strong> {incinerator.officialInfo.certifications.join(', ')}</p>
                )}

                {incinerator.officialInfo.wasteTypes && incinerator.officialInfo.wasteTypes.length > 0 && (
                  <p style={{ margin: '4px 0' }}><strong>Typy odpadu:</strong> {incinerator.officialInfo.wasteTypes.join(', ')}</p>
                )}

                <p style={{ margin: '4px 0' }}><strong>Provozní doba:</strong> {incinerator.officialInfo.operatingHours}</p>
                <p style={{ margin: '4px 0' }}><strong>Plán údržby:</strong> {incinerator.officialInfo.maintenanceSchedule}</p>
              </div>
            ) : (
              // Stručné zobrazení
              <div style={{ fontSize: '13px' }}>
                <p style={{ margin: '4px 0' }}><strong>Provozovatel:</strong> {incinerator.officialInfo.operator}</p>
                <p style={{ margin: '4px 0' }}><strong>Web:</strong> <a href={incinerator.officialInfo.website} target="_blank" rel="noopener noreferrer">Odkaz</a></p>
                <p style={{ margin: '8px 0', fontStyle: 'italic', color: '#666', fontSize: '12px' }}>
                  (Přibližte na zoom ≥ {DETAIL_ZOOM_THRESHOLD} pro více detailů)
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Popup>
  );
}

/**
 * Komponenta Map zobrazující interaktivní mapu spaloven s dynamickým načítáním dat
 */
const Map = ({ incinerators: propIncinerators }: MapProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(DEFAULT_ZOOM);

  // Získání dat z contextu
  const contextData = useIncineratorDataContext();

  // Hook pro dynamické načítání dat spaloven
  const {
    incinerators: dynamicIncinerators,
    loading,
    error,
    totalCount,
    clustered,
    usingRemoteApi,
    updateViewport,
    refetch,
    switchToRemoteApi,
    switchToLocalApi
  } = contextData || {
    // Fallback hodnoty, pokud context není dostupný (např. při použití komponenty mimo providera)
    incinerators: [],
    loading: false,
    error: null,
    totalCount: 0,
    clustered: false,
    usingRemoteApi: false,
    updateViewport: () => { },
    refetch: () => { },
    switchToRemoteApi: () => { },
    switchToLocalApi: () => { }
  };

  // Použít buď propIncinerators (pro zpětnou kompatibilitu) nebo dynamicIncinerators
  const incinerators = propIncinerators || dynamicIncinerators;

  // Prahová hodnota pro přepínání mezi režimy zobrazení (property/buildings)
  const DETAIL_ZOOM_THRESHOLD = 12;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Výpočet středu mapy na základě všech spaloven
  const calculateMapCenter = () => {
    if (!incinerators || incinerators.length === 0) {
      // Výchozí střed ČR, pokud nejsou žádné spalovny
      return [49.8, 15.5];
    }

    // Výpočet průměrné polohy všech spaloven
    const sumLat = incinerators.reduce((sum, inc) => sum + inc.location.lat, 0);
    const sumLng = incinerators.reduce((sum, inc) => sum + inc.location.lng, 0);

    return [sumLat / incinerators.length, sumLng / incinerators.length];
  };

  const mapCenter = calculateMapCenter();

  // Použití vypočteného středu všech spaloven jako výchozí střed mapy
  const initialCenter: [number, number] = mapCenter as [number, number];
  // Výchozí přiblížení pro zobrazení celé ČR
  const initialZoom = DEFAULT_ZOOM;

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
      {/* Ovládací panel pro API */}
      <div className="absolute top-3 left-3 bg-white bg-opacity-95 rounded-lg p-3 shadow-lg z-[1000]">
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Zdroj dat:</div>
          <div className="flex space-x-2">
            <button
              onClick={switchToLocalApi}
              disabled={loading}
              className={`px-3 py-1 text-xs rounded transition-colors ${!usingRemoteApi
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Lokální
            </button>
            <button
              onClick={switchToRemoteApi}
              disabled={loading}
              className={`px-3 py-1 text-xs rounded transition-colors ${usingRemoteApi
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              API
            </button>
          </div>
        </div>
      </div>

      {/* Loading indikátor */}
      {loading && (
        <div className="absolute top-3 right-3 bg-blue-100 border border-blue-400 text-blue-700 px-3 py-2 rounded z-[1000]">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
            <span>Načítám data...</span>
          </div>
        </div>
      )}

      {/* Error indikátor */}
      {error && (
        <div className="absolute top-3 right-3 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded z-[1000]">
          <div className="flex items-center space-x-2">
            <span>⚠️ Chyba: {error}</span>
            <button
              onClick={refetch}
              className="text-red-800 underline hover:no-underline"
            >
              Opakovat
            </button>
          </div>
        </div>
      )}

      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        style={mapStyle}
        scrollWheelZoom={true}
        zoomControl={false}  // Vypnout defaultní ovládací prvek zoomu
        attributionControl={true}  // Ponechat copyright odkaz
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />        {/* Komponenta pro načítání dat podle viewport */}
        <MapDataLoader onViewportChange={updateViewport} />

        {/* Komponenta pro sledování zoom úrovně */}
        <ZoomTracker onZoomChange={setCurrentZoom} />

        {/* Komponenta pro správu reference mapy */}
        <MapRefManager />

        {/* Komponenta pro resetovací tlačítko */}
        <ResetZoomControl defaultZoom={DEFAULT_ZOOM} />

        {/* DŮLEŽITÉ: Pořadí prvků definuje pořadí vykreslování (pozdější překrývají dřívější) */}

        {/* Obrysy pozemků - zobrazujeme pouze při dostatečném přiblížení */}
        {currentZoom >= DETAIL_ZOOM_THRESHOLD && incinerators && incinerators.map((incinerator) => {
          if (incinerator.propertyBoundary) {
            // Vytvoření kompletního GeoJSON objektu ve správném formátu
            const geoJsonData = {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: incinerator.propertyBoundary.coordinates
              }
            };

            return (
              <GeoJSON
                key={`property-${incinerator.id}`}
                data={geoJsonData as unknown as GeoJSON.Feature<GeoJSON.Geometry>}
                style={{
                  ...propertyStyle,
                  opacity: 1,
                  fillOpacity: 0.3,
                  weight: 3,
                  color: '#cc0000',
                  fillColor: '#ff5555'
                }}
                eventHandlers={{
                  add: (e) => {
                    console.log(`Polygon pro ${incinerator.name} byl přidán`, e);
                  }
                }}
              >
                <Popup>
                  <div>
                    <h3>{incinerator.name} - areál</h3>
                    <p>{incinerator.description}</p>
                    {incinerator.buildings && incinerator.buildings.length > 0 && (
                      <p><strong>Dvojklikem na značku přiblížíte na detaily budov</strong></p>
                    )}
                  </div>
                </Popup>
              </GeoJSON>
            );
          }
          return null;
        })}

        {/* Obrysy jednotlivých budov při vyšší úrovni přiblížení */}
        {currentZoom >= DETAIL_ZOOM_THRESHOLD && incinerators && incinerators.map((incinerator) => {
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
        })}        {/* Standardní značky spaloven */}
        {incinerators && incinerators.map((incinerator) => {
          const isPlanned = isPlannedIncinerator(incinerator);
          const icon = getIncineratorIcon(incinerator.operational, isPlanned);

          return (
            <MarkerWithDoubleClick
              key={incinerator.id}
              incinerator={incinerator}
              icon={icon}
            >
              <IncineratorPopup incinerator={incinerator} usingRemoteApi={usingRemoteApi} />
            </MarkerWithDoubleClick>
          );
        })}

      </MapContainer>      {/* Informační panel */}
      <div className="absolute bottom-3 left-3 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
        <div className="space-y-1 text-sm">
          <div className="flex items-center space-x-2">
            <span className="zoom-indicator-icon">🔍</span>
            <span>Zoom: {currentZoom.toFixed(1)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>📍</span>
            <span>Spalovny: {incinerators?.length || 0}</span>
            {totalCount > 0 && totalCount !== incinerators?.length && (
              <span className="text-gray-500">/ {totalCount} celkem</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span>🔗</span>
            <span className={usingRemoteApi ? 'text-green-600' : 'text-blue-600'}>
              {usingRemoteApi ? 'Vzdálené API' : 'Lokální data'}
            </span>
          </div>
          {clustered && (
            <div className="flex items-center space-x-2 text-blue-600">
              <span>🔄</span>
              <span>Seskupeno</span>
            </div>
          )}
          {currentZoom >= DETAIL_ZOOM_THRESHOLD && (
            <div className="flex items-center space-x-2 text-purple-600">
              <span>🏗️</span>
              <span>Detailní pohled</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Map;