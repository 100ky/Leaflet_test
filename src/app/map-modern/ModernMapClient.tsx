'use client';

import { useEffect, useState, memo, useRef } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    GeoJSON,
    useMap
} from 'react-leaflet';
import L from 'leaflet';
import { Incinerator } from '@/types';
import { getIncineratorIcon } from '@/components/map/mapIcons';
import { useIncineratorDataContext } from '@/contexts/IncineratorDataContext';
import { MapBounds } from '@/services/incineratorApi';
import { mapRegistry } from '@/utils/mapRegistry';
import { logger } from '@/utils/logger';
import { createIncineratorPopupContent } from '@/utils/mapHelpers';

// Import CSS
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

// Zablokování inicializace vyhledávacího panelu prohlížeče v mapě
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;

const MAP_CONSTANTS = {
    DEFAULT_ZOOM: 7,
    DEFAULT_CENTER: [49.8, 15.5] as [number, number],
    DETAIL_ZOOM_THRESHOLD: 12,
    MAP_STYLE: {
        height: '100%',
        width: '100%'
    }
};

const MODERN_MAP_ID = 'modern-map';

interface SidebarProps {
    incinerator: Incinerator | null;
    isOpen: boolean;
    onClose: () => void;
    usingRemoteApi: boolean;
}

// Nová responsivní sidebar komponenta  
const ResponsiveSidebar = memo(({ incinerator, isOpen, onClose, usingRemoteApi }: SidebarProps) => {
    console.log('📱 ResponsiveSidebar render:', {
        hasIncinerator: !!incinerator,
        incineratorId: incinerator?.id,
        incineratorName: incinerator?.name,
        isOpen
    });

    if (!isOpen) return null;

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900">
                    Detail spalovny
                    <span className="text-green-500 ml-2">✅</span>
                </h2>
                <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                >
                    <span className="text-xl text-gray-500">×</span>
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {incinerator ? (
                    <div className="space-y-4">
                        {/* Název a status */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {incinerator.name || `Spalovna ${incinerator.id}`}
                            </h3>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${incinerator.operational
                                ? 'bg-green-100 text-green-800'
                                : incinerator.name?.toLowerCase().includes('plán')
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                {incinerator.operational
                                    ? 'V provozu'
                                    : incinerator.name?.toLowerCase().includes('plán')
                                        ? 'Plánovaná výstavba'
                                        : 'Mimo provoz'
                                }
                            </span>
                        </div>

                        {/* Základní informace */}
                        <div className="bg-gray-50 rounded-lg p-3">
                            <h4 className="font-semibold text-gray-900 mb-2">Základní údaje</h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">ID:</span>
                                    <span className="font-medium">{incinerator.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Založeno:</span>
                                    <span className="font-medium">{incinerator.yearEstablished || 'Neznámo'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Šířka:</span>
                                    <span className="font-medium">{incinerator.location.lat.toFixed(6)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Délka:</span>
                                    <span className="font-medium">{incinerator.location.lng.toFixed(6)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Kapacita */}
                        {incinerator.capacity && (
                            <div className="bg-blue-50 rounded-lg p-3">
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                    <span className="mr-2">⚖️</span>
                                    Kapacita
                                </h4>
                                <p className="text-xl font-bold text-blue-600">
                                    {incinerator.capacity.toLocaleString()} t/rok
                                </p>
                            </div>
                        )}

                        {/* Popis */}
                        {incinerator.description && (
                            <div className="bg-gray-50 rounded-lg p-3">
                                <h4 className="font-semibold text-gray-900 mb-2">Popis</h4>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {incinerator.description}
                                </p>
                            </div>
                        )}

                        {/* Varování při vzdáleném API */}
                        {usingRemoteApi && (
                            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                                <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                                    <span className="mr-2">⚠️</span>
                                    Omezené informace
                                </h4>
                                <p className="text-sm text-yellow-700">
                                    Používáte vzdálené API, které poskytuje pouze základní informace.
                                    Pro zobrazení všech detailů (provozovatel, technické parametry, emisní limity, atd.)
                                    přepněte na &ldquo;Lokální&rdquo; data pomocí tlačítka v pravém horním rohu.
                                </p>
                            </div>
                        )}

                        {/* Oficiální informace - zobrazujeme pokud existují */}
                        {incinerator.officialInfo && !usingRemoteApi && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                    <span className="mr-2">🏢</span>
                                    Oficiální informace
                                </h4>

                                {/* Základní provozní údaje */}
                                <div className="space-y-2 text-sm mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Provozovatel:</span>
                                        <span className="font-medium text-right">{incinerator.officialInfo.operator}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Vlastník:</span>
                                        <span className="font-medium text-right">{incinerator.officialInfo.owner}</span>
                                    </div>
                                    {incinerator.officialInfo.website && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Web:</span>
                                            <a
                                                href={incinerator.officialInfo.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 text-sm underline"
                                            >
                                                Odkaz
                                            </a>
                                        </div>
                                    )}
                                    {incinerator.officialInfo.phone && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Telefon:</span>
                                            <span className="font-medium text-right">{incinerator.officialInfo.phone}</span>
                                        </div>
                                    )}
                                    {incinerator.officialInfo.email && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Email:</span>
                                            <span className="font-medium text-right text-xs break-all">{incinerator.officialInfo.email}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Technické údaje */}
                                <div className="bg-white rounded-lg p-3 mb-3">
                                    <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                                        <span className="mr-2">⚙️</span>
                                        Technické parametry
                                    </h5>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Technologie:</span>
                                            <span className="font-medium text-right">{incinerator.officialInfo.technology}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Počet linek:</span>
                                            <span className="font-medium text-right">{incinerator.officialInfo.numberOfLines}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Max. kapacita/linku:</span>
                                            <span className="font-medium text-right">{incinerator.officialInfo.maxCapacityPerLine} t/rok</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Elektrický výkon:</span>
                                            <span className="font-medium text-right">{incinerator.officialInfo.electricalPowerMW} MW</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tepelný výkon:</span>
                                            <span className="font-medium text-right">{incinerator.officialInfo.thermalPowerMW} MW</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Produkce páry:</span>
                                            <span className="font-medium text-right">{incinerator.officialInfo.steamProductionTh} t/h</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Emisní limity */}
                                {incinerator.officialInfo.emissionLimits && (
                                    <div className="bg-yellow-50 rounded-lg p-3 mb-3 border border-yellow-200">
                                        <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                                            <span className="mr-2">🌫️</span>
                                            Emisní limity
                                        </h5>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">CO:</span>
                                                <span className="font-medium">{incinerator.officialInfo.emissionLimits.CO} mg/m³</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">NOx:</span>
                                                <span className="font-medium">{incinerator.officialInfo.emissionLimits.NOx} mg/m³</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">SO2:</span>
                                                <span className="font-medium">{incinerator.officialInfo.emissionLimits.SO2} mg/m³</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Prach:</span>
                                                <span className="font-medium">{incinerator.officialInfo.emissionLimits.dust} mg/m³</span>
                                            </div>
                                            <div className="flex justify-between col-span-2">
                                                <span className="text-gray-600">Dioxiny:</span>
                                                <span className="font-medium">{incinerator.officialInfo.emissionLimits.dioxins} ng/m³</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Certifikace */}
                                {incinerator.officialInfo.certifications && incinerator.officialInfo.certifications.length > 0 && (
                                    <div className="bg-green-50 rounded-lg p-3 mb-3 border border-green-200">
                                        <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                                            <span className="mr-2">🏆</span>
                                            Certifikace
                                        </h5>
                                        <div className="flex flex-wrap gap-1">
                                            {incinerator.officialInfo.certifications.map((cert, index) => (
                                                <span key={index} className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">
                                                    {cert}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Typy odpadu */}
                                {incinerator.officialInfo.wasteTypes && incinerator.officialInfo.wasteTypes.length > 0 && (
                                    <div className="bg-orange-50 rounded-lg p-3 mb-3 border border-orange-200">
                                        <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                                            <span className="mr-2">🗑️</span>
                                            Typy odpadu
                                        </h5>
                                        <div className="flex flex-wrap gap-1">
                                            {incinerator.officialInfo.wasteTypes.map((waste, index) => (
                                                <span key={index} className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs">
                                                    {waste}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Provozní informace */}
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                                        <span className="mr-2">⏰</span>
                                        Provozní informace
                                    </h5>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Provozní doba:</span>
                                            <span className="font-medium text-right">{incinerator.officialInfo.operatingHours}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Plán údržby:</span>
                                            <span className="font-medium text-right">{incinerator.officialInfo.maintenanceSchedule}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Zdroj dat */}
                        <div className="border-t pt-3">
                            <div className="flex items-center text-xs text-gray-500">
                                <span className="mr-2">🔗</span>
                                <span>Zdroj: {usingRemoteApi ? 'Vzdálené API' : 'Lokální data'}</span>
                                {!usingRemoteApi && incinerator.officialInfo && (
                                    <span className="ml-2 text-green-600">
                                        (Rozšířené informace dostupné)
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Vyberte spalovnu pro zobrazení detailů</p>
                    </div>
                )}
            </div>
        </div>
    );
});

ResponsiveSidebar.displayName = 'ResponsiveSidebar';

// Pomocné funkce
const createMapBounds = (bounds: L.LatLngBounds): MapBounds => ({
    north: bounds.getNorth(),
    south: bounds.getSouth(),
    east: bounds.getEast(),
    west: bounds.getWest()
});

const isPlannedIncinerator = (incinerator: Incinerator): boolean => {
    return !incinerator.operational && incinerator.name?.toLowerCase().includes('plán') || false;
};

const getPropertyStyle = () => ({
    fillColor: '#e3f2fd',
    fillOpacity: 0.3,
    color: '#1976d2',
    weight: 2,
    opacity: 0.8
});

const getBuildingStyle = (buildingType?: string) => ({
    fillColor: buildingType === 'main' ? '#ff5722' : '#ff9800',
    fillOpacity: 0.7,
    color: '#d32f2f',
    weight: 2,
    opacity: 0.9
});

// Komponenta pro správu reference mapy
function MapRefManager() {
    const map = useMap();

    useEffect(() => {
        if (map) {
            mapRegistry.registerMap(MODERN_MAP_ID, map);
            logger.map('Modern map registered in global registry');
        }

        return () => {
            mapRegistry.unregisterMap(MODERN_MAP_ID);
            logger.map('Modern map unregistered from global registry');
        };
    }, [map]);

    return null;
}

// Komponenta pro sledování změn mapy
function MapDataLoader({
    onViewportChange
}: {
    onViewportChange: (bounds: MapBounds, zoom: number) => void
}) {
    const [updateTimeout, setUpdateTimeout] = useState<NodeJS.Timeout | null>(null);
    const [hasInitialLoad, setHasInitialLoad] = useState(false);

    const map = useMapEvents({
        moveend: () => {
            if (updateTimeout) {
                clearTimeout(updateTimeout);
            }

            const newTimeout = setTimeout(() => {
                const bounds = map.getBounds();
                const zoom = map.getZoom();
                const mapBounds = createMapBounds(bounds);
                onViewportChange(mapBounds, zoom);
            }, 300);

            setUpdateTimeout(newTimeout);
        },
        zoomend: () => {
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

    useEffect(() => {
        if (map && !hasInitialLoad) {
            setTimeout(() => {
                const bounds = map.getBounds();
                const zoom = map.getZoom();
                const mapBounds = createMapBounds(bounds);
                onViewportChange(mapBounds, zoom);
                setHasInitialLoad(true);
            }, 100);
        }
    }, [map, onViewportChange, hasInitialLoad]);

    useEffect(() => {
        return () => {
            if (updateTimeout) {
                clearTimeout(updateTimeout);
            }
        };
    }, [updateTimeout]);

    return null;
}

// Komponenta pro sledování zoomu
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

// Rozšíření Window interface pro TypeScript
declare global {
    interface Window {
        closeAllPopups?: () => void;
        setCurrentPopup?: (popup: L.Popup) => void;
    }
}

// Komponenta pro správu popup oken - zajišťuje, že je otevřené vždy jen jedno popup
function PopupManager() {
    const map = useMap();
    const currentPopupRef = useRef<L.Popup | null>(null);
    const allPopupsRef = useRef<Set<L.Popup>>(new Set());

    useEffect(() => {
        // Zkopírujeme reference pro cleanup
        const allPopups = allPopupsRef.current;
        const currentPopup = currentPopupRef.current;

        // Registrujeme globální funkci pro zavření všech popup oken
        window.closeAllPopups = () => {
            // Zavřeme všechny registrované popup
            allPopupsRef.current.forEach(popup => {
                try {
                    map.closePopup(popup);
                } catch {
                    // Ignorujeme chyby při zavírání popup (může být již zavřený)
                }
            });

            // Vyčistíme registry
            allPopupsRef.current.clear();
            currentPopupRef.current = null;

            // Zavřeme i všechny popup přímo přes mapu
            map.closePopup();
        };

        // Registrujeme globální funkci pro nastavení aktuálního popup
        window.setCurrentPopup = (popup: L.Popup) => {
            // Zavřeme všechny ostatní popup
            allPopupsRef.current.forEach(existingPopup => {
                if (existingPopup !== popup) {
                    try {
                        map.closePopup(existingPopup);
                    } catch {
                        // Ignorujeme chyby
                    }
                }
            });

            // Vyčistíme registry a přidáme nový popup
            allPopupsRef.current.clear();
            allPopupsRef.current.add(popup);
            currentPopupRef.current = popup;
        };

        return () => {
            // Cleanup při unmount
            delete window.closeAllPopups;
            delete window.setCurrentPopup;

            // Použijeme zkopírované reference
            allPopups.forEach(popup => {
                try {
                    map.closePopup(popup);
                } catch {
                    // Ignorujeme chyby
                }
            });

            if (currentPopup) {
                try {
                    map.closePopup(currentPopup);
                } catch {
                    // Ignorujeme chyby
                }
            }

            // Ujistíme se, že jsou všechny popup zavřené
            map.closePopup();
        };
    }, [map]);

    return null;
}

// Marker s podporou popup (klik) a sidebar (dvojklik)
function ModernMarkerWithPopupAndSidebar({
    incinerator,
    icon,
    onDoubleClick,
    usingRemoteApi
}: {
    incinerator: Incinerator;
    icon: L.Icon;
    onDoubleClick: (incinerator: Incinerator) => void;
    usingRemoteApi: boolean;
}) {
    const map = useMap();
    const markerRef = useRef<L.Marker | null>(null);
    const popupRef = useRef<L.Popup | null>(null);
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const wasPopupOpenRef = useRef(false);

    // Handler pro jednoduché kliknutí - otevře popup
    const handleClick = () => {
        // Zrušíme timeout pro dvojklik
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;
        }

        // Nastavíme timeout pro rozlišení jednoduchého kliknutí od dvojkliku
        clickTimeoutRef.current = setTimeout(() => {
            // Zavřeme všechny ostatní popup okna
            if (window.closeAllPopups) {
                window.closeAllPopups();
            }

            if (!popupRef.current && markerRef.current) {
                const currentZoom = map.getZoom();
                const popupContent = createIncineratorPopupContent(incinerator, currentZoom, usingRemoteApi);

                popupRef.current = L.popup({
                    maxWidth: 350,
                    minWidth: 250,
                    autoPan: false,
                    closeOnEscapeKey: true,
                    autoClose: false,
                    closeOnClick: false
                }).setContent(popupContent);

                markerRef.current.bindPopup(popupRef.current);
            }

            if (markerRef.current && popupRef.current) {
                markerRef.current.openPopup();
                wasPopupOpenRef.current = true;

                // Registrujeme tento popup jako aktuální
                if (window.setCurrentPopup) {
                    window.setCurrentPopup(popupRef.current);
                }
            }
        }, 200); // 200ms delay pro rozlišení od dvojkliku
    };

    // Handler pro dvojklik - otevře sidebar
    const handleDoubleClick = () => {
        // Zrušíme timeout pro jednoduché kliknutí
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;
        }

        // Zavřeme všechny popup okna
        if (window.closeAllPopups) {
            window.closeAllPopups();
        }

        // Spustíme animaci přiblížení
        map.flyTo([incinerator.location.lat, incinerator.location.lng], 15, {
            animate: true,
            duration: 1.5
        });

        // Po dokončení animace otevřeme sidebar
        setTimeout(() => {
            onDoubleClick(incinerator);
        }, 1600);
    };

    // Handler pro zavření popup
    const handlePopupClose = () => {
        wasPopupOpenRef.current = false;
        popupRef.current = null;
    };

    // Cleanup při unmount
    useEffect(() => {
        return () => {
            if (clickTimeoutRef.current) {
                clearTimeout(clickTimeoutRef.current);
            }
            if (popupRef.current) {
                popupRef.current = null;
            }
        };
    }, []);

    return (
        <Marker
            ref={markerRef}
            position={[incinerator.location.lat, incinerator.location.lng]}
            icon={icon}
            eventHandlers={{
                click: handleClick,
                dblclick: handleDoubleClick,
                popupclose: handlePopupClose,
            }}
        />
    );
}

// Minimalistický ovládací panel
const MinimalControlPanel = memo(({
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
}) => (
    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl z-[1000] p-3 border border-gray-200">
        <div className="flex items-center space-x-2">
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
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                Vzdálené
            </button>
            <button
                onClick={refetch}
                disabled={loading}
                className={`px-3 py-1 text-xs rounded transition-colors bg-orange-500 text-white hover:bg-orange-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                {loading ? '⟳' : '↻'}
            </button>
        </div>
        {error && (
            <div className="mt-2 text-xs text-red-600 max-w-xs">
                {error}
            </div>
        )}
    </div>
));

MinimalControlPanel.displayName = 'MinimalControlPanel';

// Hlavní komponenta mapy
export default function ModernMapClient() {
    const [currentZoom, setCurrentZoom] = useState<number>(MAP_CONSTANTS.DEFAULT_ZOOM);
    const [selectedIncinerator, setSelectedIncinerator] = useState<Incinerator | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Získání dat z contextu
    const {
        incinerators,
        loading,
        error,
        usingRemoteApi,
        updateViewport,
        refetch,
        switchToRemoteApi,
        switchToLocalApi
    } = useIncineratorDataContext();

    const handleDoubleClick = (incinerator: Incinerator) => {
        console.log('🔥 Modern map: handleDoubleClick called for incinerator:', incinerator.id, incinerator.name);

        // Zavřeme všechny popup okna před otevřením sidebaru
        if (window.closeAllPopups) {
            window.closeAllPopups();
        }

        setSelectedIncinerator(incinerator);
        setSidebarOpen(true);
        console.log('📱 Modern map: Sidebar should now be open:', true);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
        setTimeout(() => {
            setSelectedIncinerator(null);
        }, 300); // Po dokončení animace
    };

    // Cleanup popup při změně API
    useEffect(() => {
        // Při změně usingRemoteApi zavřeme všechny popup
        if (window.closeAllPopups) {
            window.closeAllPopups();
        }
        // Zavřeme i sidebar
        setSidebarOpen(false);
        setSelectedIncinerator(null);
    }, [usingRemoteApi]);

    // Cleanup popup při změně dat
    useEffect(() => {
        // Při změně dat zavřeme všechny popup (nová data = nové markery)
        if (window.closeAllPopups) {
            window.closeAllPopups();
        }
    }, [incinerators]);

    return (
        <div className="h-full flex relative">
            {/* Ovládací panel - vždy viditelný v pravém horním rohu */}
            <MinimalControlPanel
                loading={loading}
                usingRemoteApi={usingRemoteApi}
                error={error}
                switchToLocalApi={switchToLocalApi}
                switchToRemoteApi={switchToRemoteApi}
                refetch={refetch}
            />

            {/* Sidebar - responsivní šířka */}
            <div className={`transition-all duration-300 ease-in-out ${sidebarOpen
                ? 'w-96 opacity-100'
                : 'w-0 opacity-0 overflow-hidden'
                } bg-white shadow-2xl relative z-10 flex-shrink-0`}>
                <ResponsiveSidebar
                    incinerator={selectedIncinerator}
                    isOpen={sidebarOpen}
                    onClose={closeSidebar}
                    usingRemoteApi={usingRemoteApi}
                />
            </div>

            {/* Hlavní mapová oblast - dynamicky se přizpůsobuje */}
            <div className="flex-1 relative">
                {/* Mapa */}
                <MapContainer
                    center={MAP_CONSTANTS.DEFAULT_CENTER}
                    zoom={MAP_CONSTANTS.DEFAULT_ZOOM}
                    style={MAP_CONSTANTS.MAP_STYLE}
                    scrollWheelZoom={true}
                    zoomControl={true}
                    attributionControl={true}
                >
                    <MapRefManager />
                    <PopupManager />
                    <MapDataLoader onViewportChange={updateViewport} />
                    <ZoomTracker onZoomChange={setCurrentZoom} />

                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Vykreslení markerů */}
                    {incinerators?.map((incinerator) => {
                        const icon = getIncineratorIcon(incinerator.operational, isPlannedIncinerator(incinerator));
                        const baseKey = `modern-incinerator-${incinerator.id}`;

                        // Pro detailní pohled zobrazujeme polygony
                        if (currentZoom >= MAP_CONSTANTS.DETAIL_ZOOM_THRESHOLD &&
                            (incinerator.propertyBoundary || (incinerator.buildings && incinerator.buildings.length > 0))) {
                            return (
                                <div key={baseKey}>
                                    {/* Polygon pozemku */}
                                    {incinerator.propertyBoundary && (
                                        <GeoJSON
                                            key={`modern-property-${incinerator.id}-${Math.floor(currentZoom)}`}
                                            data={incinerator.propertyBoundary}
                                            style={getPropertyStyle()}
                                        />
                                    )}
                                    {/* Polygony budov */}
                                    {incinerator.buildings?.map((building) => (
                                        <GeoJSON
                                            key={`modern-building-${building.id}-${Math.floor(currentZoom)}`}
                                            data={building.geometry}
                                            style={getBuildingStyle(building.type)}
                                        />
                                    ))}
                                    {/* Marker */}
                                    <ModernMarkerWithPopupAndSidebar
                                        key={baseKey}
                                        incinerator={incinerator}
                                        icon={icon}
                                        onDoubleClick={handleDoubleClick}
                                        usingRemoteApi={usingRemoteApi}
                                    />
                                </div>
                            );
                        }

                        // Pro normální pohled pouze markery
                        return (
                            <ModernMarkerWithPopupAndSidebar
                                key={baseKey}
                                incinerator={incinerator}
                                icon={icon}
                                onDoubleClick={handleDoubleClick}
                                usingRemoteApi={usingRemoteApi}
                            />
                        );
                    })}
                </MapContainer>

                {/* Loading indikátor */}
                {loading && (
                    <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-20">
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                            <span className="text-sm text-gray-600">Načítání dat...</span>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
