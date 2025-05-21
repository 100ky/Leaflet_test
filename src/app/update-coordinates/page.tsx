'use client';

import { useState, useEffect, useCallback } from 'react';
import { NominatimService } from '@/services/NominatimService';
import { incineratorData } from '@/data/incinerators';

// Formát pro výpis aktualizovaných dat
interface UpdatedLocation {
    name: string;
    originalLocation: { lat: number; lng: number };
    newLocation: { lat: number; lng: number };
    polygonOffset: { lat: number; lng: number };
}

export default function UpdateCoordinates() {
    const [results, setResults] = useState<UpdatedLocation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Funkce pro výpočet posunu polygonů
    const calculatePolygonOffset = (originalLoc: { lat: number; lng: number }, newLoc: { lat: number; lng: number }) => {
        return {
            lat: newLoc.lat - originalLoc.lat,
            lng: newLoc.lng - originalLoc.lng
        };
    };

    // Funkce pro aktualizaci jedné spalovny
    const updateIncinerator = async (name: string, address: string) => {
        try {
            const service = new NominatimService();
            const coordinates = await service.geocodeAddress(address);

            // Najít spalovnu v datech
            const incinerator = incineratorData.find(inc => inc.name === name);

            if (!incinerator) {
                throw new Error(`Spalovna ${name} nebyla nalezena v datech`);
            }

            const originalLocation = { ...incinerator.location };
            const newLocation = { lat: coordinates.lat, lng: coordinates.lng };
            const polygonOffset = calculatePolygonOffset(originalLocation, newLocation);

            return {
                name,
                originalLocation,
                newLocation,
                polygonOffset
            };
        } catch (err) {
            console.error(`Chyba při aktualizaci spalovny ${name}:`, err);
            throw err;
        }
    };    // Funkce pro aktualizaci všech spaloven - obalená do useCallback
    const updateAllIncinerators = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Spustíme aktualizaci ZEVO Malešice
            const zeviResult = await updateIncinerator('ZEVO Malešice', 'ZEVO Malešice, Praha');
            setResults([zeviResult]);

            // Zde můžeme přidat další spalovny
            // const termizo = await updateIncinerator('TERMIZO Liberec', 'TERMIZO, Dr. Milady Horákové, Liberec');
            // setResults(prev => [...prev, termizo]);

        } catch (err) {
            setError(`Došlo k chybě při aktualizaci souřadnic: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setIsLoading(false);
        }
    }, [updateIncinerator]);

    useEffect(() => {
        // Automaticky spustíme aktualizaci při načtení stránky
        updateAllIncinerators();
    }, [updateAllIncinerators]); // Přidání do závislostí

    // Generování kódu pro aktualizaci incinerators.ts
    const generateUpdatedCode = (result: UpdatedLocation) => {
        const { name, newLocation, polygonOffset } = result;

        return `
Pro spalovnu "${name}":

1. Aktualizace souřadnic:
\`\`\`typescript
location: {
  lat: ${newLocation.lat},
  lng: ${newLocation.lng},
},
\`\`\`

2. Posun všech polygonů:
Posuňte všechny souřadnice polygonů o:
- Latitude: ${polygonOffset.lat.toFixed(6)}
- Longitude: ${polygonOffset.lng.toFixed(6)}

Příklad aktualizace polygonu hranice areálu:
\`\`\`typescript
propertyBoundary: {
  type: 'Polygon',
  coordinates: [[
    [${(14.5143 + polygonOffset.lng).toFixed(6)}, ${(50.0865 + polygonOffset.lat).toFixed(6)}],
    [${(14.5163 + polygonOffset.lng).toFixed(6)}, ${(50.0865 + polygonOffset.lat).toFixed(6)}],
    [${(14.5163 + polygonOffset.lng).toFixed(6)}, ${(50.0885 + polygonOffset.lat).toFixed(6)}],
    [${(14.5143 + polygonOffset.lng).toFixed(6)}, ${(50.0885 + polygonOffset.lat).toFixed(6)}],
    [${(14.5143 + polygonOffset.lng).toFixed(6)}, ${(50.0865 + polygonOffset.lat).toFixed(6)}]
  ]]
},
\`\`\`

Stejným způsobem aktualizujte všechny souřadnice budov.
`;
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Aktualizace souřadnic spaloven</h1>

            {isLoading && <p className="text-blue-500">Načítání...</p>}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p><strong>Chyba:</strong> {error}</p>
                </div>
            )}

            {results.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-xl font-bold mb-2">Výsledky aktualizace:</h2>

                    {results.map((result, index) => (
                        <div key={index} className="mb-6 p-4 bg-gray-100 rounded-lg">
                            <h3 className="text-lg font-bold">{result.name}</h3>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <h4 className="font-bold">Původní souřadnice:</h4>
                                    <p>Lat: {result.originalLocation.lat}</p>
                                    <p>Lng: {result.originalLocation.lng}</p>
                                </div>

                                <div>
                                    <h4 className="font-bold">Nové souřadnice:</h4>
                                    <p>Lat: {result.newLocation.lat}</p>
                                    <p>Lng: {result.newLocation.lng}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-bold">Posun polygonů:</h4>
                                <p>Lat: {result.polygonOffset.lat.toFixed(6)}</p>
                                <p>Lng: {result.polygonOffset.lng.toFixed(6)}</p>
                            </div>

                            <div className="mt-4">
                                <h4 className="font-bold">Kód pro aktualizaci:</h4>
                                <pre className="bg-gray-800 text-white p-4 rounded overflow-auto text-sm whitespace-pre-wrap">
                                    {generateUpdatedCode(result)}
                                </pre>
                            </div>
                        </div>
                    ))}

                    <p className="mt-4 text-sm text-gray-600">
                        Pro aktualizaci souřadnic dalších spaloven upravte funkci updateAllIncinerators.
                    </p>
                </div>
            )}

            <button
                onClick={updateAllIncinerators}
                disabled={isLoading}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
                {isLoading ? 'Aktualizace probíhá...' : 'Spustit aktualizaci znovu'}
            </button>
        </div>
    );
}
