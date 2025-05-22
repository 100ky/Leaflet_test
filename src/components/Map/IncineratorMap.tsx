'use client';

import { IncineratorLocationMap } from '@/types';
import {
    LeafletCSS,
    DEFAULT_MAP_STYLE,
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useLeafletIcon
} from './LeafletComponents';
import { Card, Badge, MapContainer as UIMapContainer } from '@/components/ui/UIComponents';

export default function IncineratorMap({ activeIncinerator }: IncineratorLocationMap) {
    // Použití vlastního hooku pro inicializaci ikony
    const referenceIcon = useLeafletIcon('/images/marker-nonoperational.png');

    // Podmíněné renderování pro případ null activeIncinerator
    if (!activeIncinerator) {
        return (
            <Card title="Mapa spalovny">
                <div style={DEFAULT_MAP_STYLE} className="bg-gray-100 flex items-center justify-center text-gray-500">
                    Vyberte spalovnu k zobrazení na mapě
                </div>
            </Card>
        );
    }

    return (
        <Card title={`Mapa pro ${activeIncinerator.name}`}>
            <LeafletCSS />
            <div className="mb-4 flex flex-wrap gap-2">
                <Badge variant="success">
                    Zelená značka = aktuální data
                </Badge>
                <Badge variant="danger">
                    Červená značka = referenční data
                </Badge>
            </div>

            <UIMapContainer>
                <MapContainer
                    center={[
                        activeIncinerator.currentLocation.lat,
                        activeIncinerator.currentLocation.lng
                    ]}
                    zoom={15}
                    style={DEFAULT_MAP_STYLE}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* Značka pro aktuální data */}
                    <Marker
                        position={[
                            activeIncinerator.currentLocation.lat,
                            activeIncinerator.currentLocation.lng
                        ]}
                    >
                        <Popup>
                            <div>
                                <h3 className="font-bold">{activeIncinerator.name} - Aktuální data</h3>
                                <p>Lat: {activeIncinerator.currentLocation.lat.toFixed(6)}</p>
                                <p>Lng: {activeIncinerator.currentLocation.lng.toFixed(6)}</p>
                            </div>
                        </Popup>
                    </Marker>
                    {/* Značka pro referenční data */}
                    {referenceIcon && (
                        <Marker
                            position={[
                                activeIncinerator.referenceLocation.lat,
                                activeIncinerator.referenceLocation.lng
                            ]}
                            icon={referenceIcon}
                        >
                            <Popup>
                                <div>
                                    <h3 className="font-bold">{activeIncinerator.name} - Referenční data</h3>
                                    <p>Lat: {activeIncinerator.referenceLocation.lat.toFixed(6)}</p>
                                    <p>Lng: {activeIncinerator.referenceLocation.lng.toFixed(6)}</p>
                                </div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </UIMapContainer>
        </Card>
    );
}
