'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CoordinateFormat {
    description: string;
    latitude: string;
    longitude: string;
}

// Převody mezi formáty souřadnic
function decimalToDMS(coord: number, isLat: boolean): string {
    const absolute = Math.abs(coord);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);

    const direction = isLat
        ? (coord >= 0 ? "N" : "S")
        : (coord >= 0 ? "E" : "W"); return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
}

// Funkce pro převod DMS formátu na desetinný formát
// Momentálně nepoužívaná, ale ponecháváme pro budoucí použití
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function dmsToDecimal(dms: string): number | null {
    // Příklad: 50° 4' 46.76" N
    const regex = /(\d+)°\s*(\d+)'\s*(\d+(?:\.\d+)?)"\s*([NSEW])/;
    const match = dms.match(regex);

    if (!match) return null;

    const degrees = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const seconds = parseFloat(match[3]);
    const direction = match[4];

    let decimal = degrees + (minutes / 60) + (seconds / 3600);
    if (direction === 'S' || direction === 'W') decimal = -decimal;

    return decimal;
}

export default function CoordinateConverter() {
    const [latitude, setLatitude] = useState<string>('50.079655');
    const [longitude, setLongitude] = useState<string>('14.540570');
    const [formats, setFormats] = useState<CoordinateFormat[]>([]);

    const handleConvert = () => {
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);

        if (isNaN(lat) || isNaN(lng)) {
            alert('Neplatné souřadnice. Zadejte platná čísla.');
            return;
        }

        const result: CoordinateFormat[] = [
            {
                description: 'Decimální stupně (Leaflet, Google Maps)',
                latitude: lat.toFixed(6),
                longitude: lng.toFixed(6)
            },
            {
                description: 'Stupně, minuty, vteřiny (DMS)',
                latitude: decimalToDMS(lat, true),
                longitude: decimalToDMS(lng, false)
            },
            {
                description: 'GeoJSON formát [lng, lat]',
                latitude: `[${lng.toFixed(6)}, ${lat.toFixed(6)}]`,
                longitude: ''
            },
            {
                description: 'Leaflet marker [lat, lng]',
                latitude: `[${lat.toFixed(6)}, ${lng.toFixed(6)}]`,
                longitude: ''
            },
            {
                description: 'URL pro Google Maps',
                latitude: `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`,
                longitude: ''
            }
        ];

        setFormats(result);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Konverze formátů souřadnic</h1>

            <div className="mb-4">
                <Link href="/" className="text-blue-500 hover:underline">
                    ← Zpět na hlavní stránku
                </Link>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <h2 className="text-lg font-bold mb-2">Zadejte souřadnice v decimálním formátu</h2>
                <p className="mb-4 text-sm text-gray-600">
                    Zadejte souřadnice v decimálním formátu (např. 50.079655, 14.540570 pro ZEVO Malešice)
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block mb-2 font-semibold">Zeměpisná šířka (latitude):</label>
                        <input
                            type="text"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="50.079655"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Zeměpisná délka (longitude):</label>
                        <input
                            type="text"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="14.540570"
                        />
                    </div>
                </div>

                <button
                    onClick={handleConvert}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Převést do různých formátů
                </button>
            </div>

            {formats.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-lg font-bold mb-2">Výsledky konverze:</h2>

                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Formát
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hodnota
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Akce
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {formats.map((format, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {format.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 break-all">
                                            {format.longitude ? (
                                                <>
                                                    <div>{format.latitude}</div>
                                                    <div>{format.longitude}</div>
                                                </>
                                            ) : (
                                                <div>{format.latitude}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={() => {
                                                    const textToCopy = format.longitude
                                                        ? `${format.latitude}, ${format.longitude}`
                                                        : format.latitude;

                                                    navigator.clipboard.writeText(textToCopy)
                                                        .then(() => alert('Zkopírováno do schránky'))
                                                        .catch(err => console.error('Chyba při kopírování', err));
                                                }}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                Kopírovat
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 bg-blue-50 p-4 rounded-lg text-sm">
                        <h3 className="font-bold mb-2">Poznámky k formátům:</h3>
                        <ul className="list-disc list-inside">
                            <li><strong>Decimální stupně:</strong> Standardní formát používaný v mnoha aplikacích, čísla s desetinnou čárkou.</li>
                            <li><strong>DMS (Stupně, minuty, vteřiny):</strong> Tradiční formát používaný pro geografické souřadnice.</li>
                            <li><strong>GeoJSON:</strong> V GeoJSON se souřadnice zadávají jako [longitude, latitude] - opačně než ve většině případů!</li>
                            <li><strong>Leaflet marker:</strong> Pro marker v Leafletu se používá formát [latitude, longitude].</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
