// src/services/NominatimService.ts
import { GeocodingService } from '@/types';

/**
 * Implementace geokódovací služby pomocí Nominatim API.
 * Tato služba umožňuje geokódování a reverzní geokódování.
 */
export class NominatimService implements GeocodingService {
    private baseUrl = 'https://nominatim.openstreetmap.org';

    /**
     * Geokóduje adresu na souřadnice (lat, lng).
     * @param address Adresa k geokódování.
     * @returns Souřadnice ve formátu { lat, lng }.
     */
    async geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
        const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(address)}&format=json`);
        const data = await response.json();

        if (!data || data.length === 0) {
            throw new Error('Adresa nebyla nalezena.');
        }

        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }

    /**
     * Reverzní geokódování souřadnic na adresu.
     * @param lat Zeměpisná šířka.
     * @param lng Zeměpisná délka.
     * @returns Adresa jako textový řetězec.
     */
    async reverseGeocode(lat: number, lng: number): Promise<string> {
        const response = await fetch(`${this.baseUrl}/reverse?lat=${lat}&lon=${lng}&format=json`);
        const data = await response.json();

        if (!data || !data.display_name) {
            throw new Error('Adresa nebyla nalezena.');
        }

        return data.display_name;
    }
}
