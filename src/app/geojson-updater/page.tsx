'use client';

import { useState } from 'react';
import { incineratorData } from '@/data/incinerators';
import { Building } from '@/types';

// Pomocné funkce pro konverzi a aktualizaci koordinátů
function updateGeoJsonCoordinates(coordinates: number[][][], latOffset: number, lngOffset: number): number[][][] {
    return coordinates.map(ring => {
        return ring.map(point => {
            // V GeoJSON je pořadí [longitude, latitude]
            return [point[0] + lngOffset, point[1] + latOffset];
        });
    });
}

export default function GeoJsonUpdater() {
    const [incineratorId, setIncineratorId] = useState<string>('1'); // ZEVO Malešice ID
    const [latOffset, setLatOffset] = useState<string>('-0.007845');
    const [lngOffset, setLngOffset] = useState<string>('0.025270');
    const [updatedCode, setUpdatedCode] = useState<string>('');

    const handleGenerateCode = () => {
        const incinerator = incineratorData.find(inc => inc.id === incineratorId);
        if (!incinerator) {
            setUpdatedCode('Spalovna s tímto ID nebyla nalezena.');
            return;
        }

        const latOffsetNum = parseFloat(latOffset);
        const lngOffsetNum = parseFloat(lngOffset);

        if (isNaN(latOffsetNum) || isNaN(lngOffsetNum)) {
            setUpdatedCode('Neplatné hodnoty offsetu. Zadejte platná čísla.');
            return;
        }

        let code = `// Aktualizovaná data pro spalovnu ${incinerator.name}\n`;

        // Aktualizace hlavní lokace
        code += `\n// Hlavní lokace\nlocation: {\n  lat: ${incinerator.location.lat + latOffsetNum},\n  lng: ${incinerator.location.lng + lngOffsetNum},\n},\n`;

        // Aktualizace obrysu areálu
        if (incinerator.propertyBoundary) {
            const updatedPropertyBoundary = updateGeoJsonCoordinates(
                incinerator.propertyBoundary.coordinates,
                latOffsetNum,
                lngOffsetNum
            );

            code += '\n// Obrys areálu\npropertyBoundary: {\n  type: \'Polygon\',\n  coordinates: [\n';
            updatedPropertyBoundary.forEach((ring, ringIndex) => {
                code += '    [\n';
                ring.forEach((point, pointIndex) => {
                    code += `      [${point[0].toFixed(6)}, ${point[1].toFixed(6)}]${pointIndex < ring.length - 1 ? ',' : ''}\n`;
                });
                code += `    ]${ringIndex < updatedPropertyBoundary.length - 1 ? ',' : ''}\n`;
            });
            code += '  ]\n},\n';
        }        // Aktualizace budov
        if (incinerator.buildings && incinerator.buildings.length > 0) {
            code += '\n// Budovy\nbuildings: [\n';
            incinerator.buildings.forEach((building: Building, buildingIndex) => {
                code += `  {\n    id: '${building.id}',\n    name: '${building.name}',\n    type: BuildingType.${building.type},\n`;
                if (building.description) {
                    code += `    description: '${building.description}',\n`;
                }

                const updatedBuildingGeometry = updateGeoJsonCoordinates(
                    building.geometry.coordinates,
                    latOffsetNum,
                    lngOffsetNum
                );

                code += '    geometry: {\n      type: \'Polygon\',\n      coordinates: [\n';
                updatedBuildingGeometry.forEach((ring, ringIndex) => {
                    code += '        [\n';
                    ring.forEach((point, pointIndex) => {
                        code += `          [${point[0].toFixed(6)}, ${point[1].toFixed(6)}]${pointIndex < ring.length - 1 ? ',' : ''}\n`;
                    });
                    code += `        ]${ringIndex < updatedBuildingGeometry.length - 1 ? ',' : ''}\n`;
                });
                code += '      ]\n    },\n';

                if (building.details) {
                    code += '    details: {\n';
                    if (building.details.yearBuilt) {
                        code += `      yearBuilt: ${building.details.yearBuilt},\n`;
                    }
                    if (building.details.areaInSqMeters) {
                        code += `      areaInSqMeters: ${building.details.areaInSqMeters},\n`;
                    }
                    if (building.details.function) {
                        code += `      function: '${building.details.function}'\n`;
                    }
                    code += '    }\n';
                }

                code += `  }${buildingIndex < (incinerator.buildings?.length || 0) - 1 ? ',' : ''}\n`;
            });
            code += ']\n';
        }

        setUpdatedCode(code);
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(updatedCode)
            .then(() => {
                alert('Kód zkopírován do schránky!');
            })
            .catch(err => {
                console.error('Chyba při kopírování: ', err);
            });
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Aktualizace GeoJSON souřadnic</h1>

            <div className="mb-4 bg-gray-100 p-4 rounded-lg">
                <h2 className="text-lg font-bold mb-2">Nástroj pro aktualizaci souřadnic polygonů</h2>
                <p className="mb-4">
                    Tento nástroj vám pomůže aktualizovat všechny souřadnice v GeoJSON polygonech podle zadaného offsetu.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block mb-2 font-semibold">ID spalovny:</label>
                        <select
                            value={incineratorId}
                            onChange={(e) => setIncineratorId(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            {incineratorData.map(inc => (
                                <option key={inc.id} value={inc.id}>{inc.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Offset zeměpisné šířky (lat):</label>
                        <input
                            type="text"
                            value={latOffset}
                            onChange={(e) => setLatOffset(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Offset zeměpisné délky (lng):</label>
                        <input
                            type="text"
                            value={lngOffset}
                            onChange={(e) => setLngOffset(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>

                <button
                    onClick={handleGenerateCode}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Generovat kód
                </button>
            </div>

            {updatedCode && (
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold">Vygenerovaný kód:</h3>
                        <button
                            onClick={handleCopyToClipboard}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition text-sm"
                        >
                            Kopírovat do schránky
                        </button>
                    </div>

                    <pre className="bg-gray-800 text-white p-4 rounded overflow-auto text-sm whitespace-pre-wrap">
                        {updatedCode}
                    </pre>

                    <div className="mt-4 bg-yellow-100 p-4 rounded text-sm">
                        <h4 className="font-bold mb-2">Instrukce pro použití:</h4>
                        <ol className="list-decimal list-inside">
                            <li>Zkopírujte vygenerovaný kód</li>
                            <li>Otevřete soubor <code>src/data/incinerators.ts</code></li>
                            <li>Nahraďte příslušné části kódu pro danou spalovnu</li>
                            <li>Nezapomeňte, že v GeoJSON je pořadí souřadnic [longitude, latitude]</li>
                            <li>Ujistěte se, že zachováváte správnou strukturu a formátování souboru</li>
                        </ol>
                    </div>
                </div>
            )}
        </div>
    );
}
