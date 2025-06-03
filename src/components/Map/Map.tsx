/**
 * Map - Hlavní komponenta pro zobrazení interaktivní mapy
 * Obsahuje Leaflet mapu s markery spaloven, popup okna a ovládací prvky
 */

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
import { Incinerator } from '@/types';
import { getIncineratorIcon } from './mapIcons';
import { useIncineratorDataContext } from '@/contexts/IncineratorDataContext';
import { MapBounds } from '@/services/incineratorApi';
import { mapRegistry, DEFAULT_MAP_ID } from '@/utils/mapRegistry';
import { logger } from '@/utils/logger';
import {
  getBuildingStyle,
  getPropertyStyle,
  createIncineratorPopupContent,
  MAP_CONSTANTS
} from '@/utils/mapHelpers';
import L from 'leaflet';

const mapStyle = MAP_CONSTANTS.MAP_STYLE;

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
      logger.map('Map registered in global registry');
    }

    // Cleanup při unmount
    return () => {
      mapRegistry.unregisterMap(DEFAULT_MAP_ID);
      logger.map('Map unregistered from global registry');
    };
  }, [map]);

  return null;
}

/**
 * Pomocná funkce pro vytvoření MapBounds objektu z Leaflet bounds
 */
const createMapBounds = (bounds: L.LatLngBounds): MapBounds => ({
  north: bounds.getNorth(),
  south: bounds.getSouth(),
  east: bounds.getEast(),
  west: bounds.getWest()
});

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
      const mapBounds = createMapBounds(bounds);
      onViewportChange(mapBounds, zoom);
    },
    zoomend: () => {
      const bounds = map.getBounds();
      const zoom = map.getZoom();
      const mapBounds = createMapBounds(bounds);
      onViewportChange(mapBounds, zoom);
    }
  });

  // Iniciální načtení dat po načtení mapy
  useEffect(() => {
    const bounds = map.getBounds();
    const zoom = map.getZoom();
    const mapBounds = createMapBounds(bounds);
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

  // Sledování změn zoomu
  useMapEvents({
    zoomend: () => {
      setCurrentZoom(map.getZoom());
    }
  });

  useEffect(() => {
    setCurrentZoom(map.getZoom());
  }, [map]);

  return (
    <Popup maxWidth={350} minWidth={250}>
      <div dangerouslySetInnerHTML={{
        __html: createIncineratorPopupContent(incinerator, currentZoom, usingRemoteApi)
      }} />
    </Popup>
  );
}

/**
 * Komponenta Map zobrazující interaktivní mapu spaloven s dynamickým načítáním dat
 */
const Map = ({ incinerators: propIncinerators }: MapProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [currentZoom, setCurrentZoom] = useState<number>(MAP_CONSTANTS.DEFAULT_ZOOM);

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
  const initialZoom = MAP_CONSTANTS.DEFAULT_ZOOM;

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
        <ResetZoomControl defaultZoom={MAP_CONSTANTS.DEFAULT_ZOOM} />

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
                  ...getPropertyStyle(),
                  opacity: 1,
                  fillOpacity: 0.3,
                  weight: 3,
                  color: '#cc0000',
                  fillColor: '#ff5555'
                }}
                eventHandlers={{
                  add: (e) => {
                    logger.debug(`Polygon pro ${incinerator.name} byl přidán`, e);
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