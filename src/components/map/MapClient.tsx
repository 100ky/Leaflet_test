/**
 * Klientská mapová komponenta pro zobrazení spaloven v České republice
 * 
 * Obsahuje veškerou interaktivní funkcionalitu včetně:
 * - Načítání a zobrazení dat spaloven
 * - Interakce s markery a popup okny
 * - Správa stavu mapy a filtrů
 * - Optimalizace výkonu pro velká datová sady
 */

'use client';

import { useEffect, useState, memo } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    GeoJSON,
    useMap
} from 'react-leaflet';
import L from 'leaflet';

// Oprava inicializace ikon pro kompatibilitu s Leaflet v Next.js SSR
// @see https://github.com/Leaflet/Leaflet/issues/7255
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

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
    isPlannedIncinerator,
    MAP_CONSTANTS
} from '@/utils/mapHelpers';

const mapStyle = {
    ...MAP_CONSTANTS.MAP_STYLE,    // Stabilizace rozložení - předcházení změnám velikosti při načítání
    minHeight: MAP_CONSTANTS.MAP_STYLE.height,
    overflow: 'hidden' // Zabránění posunu obsahu při změnách velikosti
};

interface MapClientProps {
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
 * Komponenta pro sledování změn mapy a načítání dat s debounce mechanismem
 */
function MapDataLoader({
    onViewportChange
}: {
    onViewportChange: (bounds: MapBounds, zoom: number) => void
}) {
    const [updateTimeout, setUpdateTimeout] = useState<NodeJS.Timeout | null>(null);
    const [hasInitialLoad, setHasInitialLoad] = useState(false);

    const map = useMapEvents({
        moveend: () => {
            // Zrušíme předchozí timeout
            if (updateTimeout) {
                clearTimeout(updateTimeout);
            }

            // Nastavíme nový timeout - data se načtou až po 300ms nečinnosti
            const newTimeout = setTimeout(() => {
                const bounds = map.getBounds();
                const zoom = map.getZoom();
                const mapBounds = createMapBounds(bounds);
                onViewportChange(mapBounds, zoom);
            }, 300);

            setUpdateTimeout(newTimeout);
        },
        zoomend: () => {
            // Při zoomu načteme data okamžitě (je to důležitější než moveend)
            if (updateTimeout) {
                clearTimeout(updateTimeout);
                setUpdateTimeout(null);
            }

            const bounds = map.getBounds();
            const zoom = map.getZoom();
            const mapBounds = createMapBounds(bounds);
            onViewportChange(mapBounds, zoom);
        }
    });

    // Initial load - spustí se když je mapa připravena
    useEffect(() => {
        if (map && !hasInitialLoad) {
            // Krátké zpoždění aby se mapa stabilizovala
            setTimeout(() => {
                const bounds = map.getBounds();
                const zoom = map.getZoom();
                const mapBounds = createMapBounds(bounds);
                logger.map('Initial map load - triggering viewport change', { bounds: mapBounds, zoom });
                onViewportChange(mapBounds, zoom);
                setHasInitialLoad(true);
            }, 100);
        }
    }, [map, onViewportChange, hasInitialLoad]);

    // Cleanup timeout při unmount
    useEffect(() => {
        return () => {
            if (updateTimeout) {
                clearTimeout(updateTimeout);
            }
        };
    }, [updateTimeout]);

    return null;
}

/**
 * Komponenta pro sledování zoomu
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
 * Komponenta tlačítka pro reset mapy - umístěno pod zoom ovládáním
 */
function ResetButton({ onReset }: { onReset: () => void }) {
    return (
        <div className="leaflet-top leaflet-left" style={{ marginTop: '74px' }}>
            <div className="leaflet-control leaflet-bar reset-zoom-control">
                <button
                    onClick={onReset}
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
function MarkerWithDoubleClick({ incinerator, icon, usingRemoteApi }: { incinerator: Incinerator, icon: L.Icon, usingRemoteApi: boolean }) {
    const map = useMap();
    const [currentZoom, setCurrentZoom] = useState(map.getZoom());
    const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

    // Sledování změn zoomu
    useMapEvents({
        zoomend: () => {
            setCurrentZoom(map.getZoom());
        }
    }); const handleClick = () => {
        // Delay pro rozlišení mezi click a dblclick
        const timeout = setTimeout(() => {
            logger.debug(`Click event na spalovnu: ${incinerator.name}`);

            // Zavři všechny existující popupy
            map.closePopup();

            const content = createIncineratorPopupContent(incinerator, currentZoom, usingRemoteApi);

            L.popup({
                maxWidth: 350,
                minWidth: 250,
                autoPan: true,
                closeOnEscapeKey: true,
                autoClose: false,
                closeOnClick: false,
                offset: [0, -40] // Posune popup nahoru od markeru
            })
                .setLatLng([incinerator.location.lat, incinerator.location.lng]).setContent(content)
                .openOn(map);

            logger.debug(`Popup otevřen pro: ${incinerator.name}`);
        }, 200);

        setClickTimeout(timeout);
    };

    const handleDoubleClick = () => {
        // Zruš pending click event
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            setClickTimeout(null);
        }

        logger.debug(`Double-click event na spalovnu: ${incinerator.name}`);

        // Zavři všechny popupy
        map.closePopup();

        // Animace flyTo
        map.flyTo([incinerator.location.lat, incinerator.location.lng], 15, {
            animate: true,
            duration: 1.5
        });

        // Po animaci otevři popup
        map.once('moveend', () => {
            setTimeout(() => {
                const content = createIncineratorPopupContent(incinerator, map.getZoom(), usingRemoteApi);

                L.popup({
                    maxWidth: 350,
                    minWidth: 250,
                    autoPan: true,
                    closeOnEscapeKey: true,
                    autoClose: false,
                    closeOnClick: false,
                    offset: [0, -40] // Posune popup nahoru od markeru
                })
                    .setLatLng([incinerator.location.lat, incinerator.location.lng]).setContent(content)
                    .openOn(map);

                logger.debug(`Double-click popup otevřen pro: ${incinerator.name}`);
            }, 500);
        });
    };

    // Cleanup timeout při unmount
    useEffect(() => {
        return () => {
            if (clickTimeout) {
                clearTimeout(clickTimeout);
            }
        };
    }, [clickTimeout]);

    return (
        <Marker
            position={[incinerator.location.lat, incinerator.location.lng]}
            icon={icon}
            eventHandlers={{
                click: handleClick,
                dblclick: handleDoubleClick
            }}
        />
    );
}

/**
 * Optimalizovaný ovládací panel s memo pro předcházení zbytečnému překreslování
 */
const ControlPanel = memo(function ControlPanel({
    loading,
    usingRemoteApi,
    error,
    switchToLocalApi,
    switchToRemoteApi,
    refetch
}: {
    loading: boolean;
    usingRemoteApi: boolean;
    error: string | null;
    switchToLocalApi: () => void;
    switchToRemoteApi: () => void;
    refetch: () => void;
}) {
    return (
        <div className="absolute top-3 right-3 bg-white bg-opacity-95 rounded-lg shadow-lg z-[1000] w-40">
            <div className="p-3 space-y-2">
                <div className="text-sm font-medium text-gray-700">Zdroj dat:</div>
                <div className="flex space-x-2">
                    <button
                        onClick={switchToLocalApi}
                        disabled={loading}
                        className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${!usingRemoteApi
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Lokální
                    </button>
                    <button
                        onClick={switchToRemoteApi}
                        disabled={loading}
                        className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${usingRemoteApi
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Vzdálené
                    </button>
                </div>
                <button
                    onClick={refetch}
                    disabled={loading}
                    className={`w-full px-3 py-1 text-xs rounded transition-colors bg-orange-500 text-white hover:bg-orange-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    <span className="inline-block w-16">
                        {loading ? 'Načítá...' : 'Obnovit'}
                    </span>
                </button>
                {/* Vylepšený prostor pro chybové zprávy s automatickým mizením */}
                <div className="min-h-[20px]">
                    {error && (
                        <div className={`text-xs p-2 rounded transition-all duration-300 ${error.includes('opakuji požadavek')
                            ? 'text-yellow-700 bg-yellow-50 border-l-2 border-yellow-400 animate-pulse'
                            : error.includes('Server je dočasně nedostupný')
                                ? 'text-orange-600 bg-orange-50 border-l-2 border-orange-400'
                                : error.includes('Problém se sítí')
                                    ? 'text-blue-600 bg-blue-50 border-l-2 border-blue-400'
                                    : 'text-red-600 bg-red-50 border-l-2 border-red-400'
                            }`}>
                            <div className="flex items-start space-x-1">
                                <span className="flex-shrink-0 mt-0.5">
                                    {error.includes('opakuji požadavek') ? '🔄' :
                                        error.includes('dočasně nedostupný') ? '⚠️' :
                                            error.includes('sítí') ? '🌐' : '❌'}
                                </span>
                                <span className="break-words">
                                    {error}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

/**
 * Optimalizovaný informační panel s memo pro předcházení zbytečnému překreslování
 */
const InfoPanel = memo(function InfoPanel({
    currentZoom,
    incineratorsCount,
    totalCount,
    usingRemoteApi,
    clustered,
    loading,
    DETAIL_ZOOM_THRESHOLD
}: {
    currentZoom: number;
    incineratorsCount: number;
    totalCount: number;
    usingRemoteApi: boolean;
    clustered: boolean;
    loading: boolean;
    DETAIL_ZOOM_THRESHOLD: number;
}) {
    return (
        <div className="absolute bottom-3 left-3 bg-white bg-opacity-90 rounded-lg shadow-lg w-60">
            <div className="p-3 space-y-1 text-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="zoom-indicator-icon">🔍</span>
                        <span>Zoom: {currentZoom.toFixed(1)}</span>
                    </div>
                    {loading && (
                        <div className="flex items-center space-x-1">
                            <div className="animate-spin w-3 h-3 border border-gray-400 border-t-transparent rounded-full"></div>
                            <span className="text-xs text-gray-700">Načítá</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <span>📍</span>
                    <span>Spalovny: {incineratorsCount}</span>
                    {totalCount > 0 && totalCount !== incineratorsCount && (
                        <span className="text-gray-700">/ {totalCount} celkem</span>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <span>🔗</span>
                    <span className={usingRemoteApi ? 'text-green-600' : 'text-blue-600'}>
                        {usingRemoteApi ? 'Vzdálené API' : 'Lokální data'}
                    </span>
                </div>
                <div className="flex items-center space-x-4">
                    {clustered && (
                        <div className="flex items-center space-x-1 text-blue-600">
                            <span>🔄</span>
                            <span className="text-xs">Seskupeno</span>
                        </div>
                    )}
                    {currentZoom >= DETAIL_ZOOM_THRESHOLD && (
                        <div className="flex items-center space-x-1 text-purple-600">
                            <span>🏗️</span>
                            <span className="text-xs">Detailní pohled</span>
                        </div>
                    )}            </div>
            </div>
        </div>
    );
});

/**
 * Klientská komponenta MapClient zobrazující interaktivní mapu spaloven s dynamickým načítáním dat
 */
const MapClient = ({ incinerators: propIncinerators }: MapClientProps) => {
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

    return (
        <div className="map-container relative">
            {/* Optimalizovaný ovládací panel */}
            <ControlPanel
                loading={loading}
                usingRemoteApi={usingRemoteApi}
                error={error}
                switchToLocalApi={switchToLocalApi}
                switchToRemoteApi={switchToRemoteApi}
                refetch={refetch}
            />

            {/* Reset tlačítko */}
            <ResetButton onReset={() => {
                const map = mapRegistry.getMap(DEFAULT_MAP_ID);
                if (map) {
                    map.setView(initialCenter, initialZoom);
                }
            }} />

            <MapContainer
                center={initialCenter}
                zoom={initialZoom}
                style={mapStyle}
                scrollWheelZoom={true}
                zoomControl={true}
                attributionControl={true}
            >
                <MapRefManager />

                <MapDataLoader onViewportChange={updateViewport} />

                <ZoomTracker onZoomChange={setCurrentZoom} />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Vykreslení markerů pro spalovny s memo optimalizací */}
                {incinerators?.map((incinerator) => {
                    const icon = getIncineratorIcon(incinerator.operational, isPlannedIncinerator(incinerator));

                    // Unikátní klíč který zahrnuje zoom pro správné překreslení při změně detailnosti
                    const baseKey = `incinerator-${incinerator.id}`;
                    const detailKey = currentZoom >= DETAIL_ZOOM_THRESHOLD ? `${baseKey}-detail-${Math.floor(currentZoom)}` : baseKey;

                    // Pro detailní pohled (vysoký zoom) zobrazujeme polygony
                    if (currentZoom >= DETAIL_ZOOM_THRESHOLD && (incinerator.propertyBoundary || (incinerator.buildings && incinerator.buildings.length > 0))) {
                        return (
                            <div key={detailKey}>
                                {/* Polygon pozemku */}
                                {incinerator.propertyBoundary && (
                                    <GeoJSON
                                        key={`property-${incinerator.id}-${Math.floor(currentZoom)}`}
                                        data={incinerator.propertyBoundary}
                                        style={getPropertyStyle()}
                                    />
                                )}
                                {/* Polygony jednotlivých budov */}
                                {incinerator.buildings?.map((building) => (
                                    <GeoJSON
                                        key={`building-${building.id}-${Math.floor(currentZoom)}`}
                                        data={building.geometry}
                                        style={getBuildingStyle(building.type)}
                                    />
                                ))}
                                {/* Marker pro popup */}
                                <MarkerWithDoubleClick
                                    key={`marker-${incinerator.id}`}
                                    incinerator={incinerator}
                                    icon={icon}
                                    usingRemoteApi={usingRemoteApi}
                                />
                            </div>
                        );
                    }

                    // Pro normální pohled zobrazujeme pouze markery
                    return (
                        <MarkerWithDoubleClick
                            key={baseKey}
                            incinerator={incinerator}
                            icon={icon}
                            usingRemoteApi={usingRemoteApi}
                        />
                    );
                })}

            </MapContainer>

            {/* Optimalizovaný informační panel */}
            <InfoPanel
                currentZoom={currentZoom}
                incineratorsCount={incinerators?.length || 0}
                totalCount={totalCount}
                usingRemoteApi={usingRemoteApi}
                clustered={clustered}
                loading={loading}
                DETAIL_ZOOM_THRESHOLD={DETAIL_ZOOM_THRESHOLD}
            />
        </div>
    );
};

export default MapClient;
