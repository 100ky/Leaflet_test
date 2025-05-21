"use client";

import { useState, useEffect } from 'react';
import { NominatimService } from '@/services/NominatimService';

export default function TestNominatim() {
    const [geocodeResult, setGeocodeResult] = useState<{ lat: number; lng: number } | null>(null);
    const [reverseResult, setReverseResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function testService() {
            setLoading(true);
            setError(null);

            try {
                const service = new NominatimService();

                // Test geocodeAddress
                const address = 'ZEVO Malešice, Praha';
                const coordinates = await service.geocodeAddress(address);
                setGeocodeResult(coordinates);

                // Test reverseGeocode
                const resolvedAddress = await service.reverseGeocode(coordinates.lat, coordinates.lng);
                setReverseResult(resolvedAddress);
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        }

        testService();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Test Nominatim Service</h1>

            {loading && <p>Načítání...</p>}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p><strong>Chyba:</strong> {error}</p>
                </div>
            )}

            {geocodeResult && (
                <div className="mb-4">
                    <h2 className="text-xl font-bold">Výsledek geokódování</h2>
                    <p>Adresa: <strong>ZEVO Malešice, Praha</strong></p>
                    <p>Souřadnice: {geocodeResult.lat}, {geocodeResult.lng}</p>
                </div>
            )}

            {reverseResult && (
                <div className="mb-4">
                    <h2 className="text-xl font-bold">Výsledek reverzního geokódování</h2>
                    <p>Adresa: {reverseResult}</p>
                </div>
            )}
        </div>
    );
}
