// Definice typu pro aktualizaci spalovny
export interface IncineratorUpdate {
    id: string;
    name: string;
    currentLocation: { lat: number; lng: number };
    referenceLocation: { lat: number; lng: number };
    distanceInMeters: number;
    needsUpdate: boolean;
    selected: boolean;
}
