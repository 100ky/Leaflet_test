'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { incineratorData } from '@/data/incinerators';
import { IncineratorUpdate } from './types';
import dynamic from 'next/dynamic';

// Dynamicky importujeme komponentu mapy
const IncineratorMap = dynamic(
    () => import('./components/IncineratorMap'),
    { ssr: false, loading: () => <div className="h-[500px] w-full bg-gray-100 flex items-center justify-center text-gray-500">Načítání mapy...</div> }
);

// Referenční souřadnice z Google Maps
const referenceCoordinates: Record<string, { lat: number; lng: number }> = {
    'ZEVO Malešice': { lat: 50.079655, lng: 14.5405696 },
    'SAKO Brno': { lat: 49.18944, lng: 16.65713 },
    'TERMIZO Liberec': { lat: 50.7626, lng: 15.0562 },
    'ZEVO Chotíkov': { lat: 49.7973, lng: 13.2877 },
    'Plánovaná spalovna Ostrava': { lat: 49.8283, lng: 18.2652 },
    'ZEVO Plzeň': { lat: 49.7572, lng: 13.3635 },
    'ECOREC Martin': { lat: 49.0662, lng: 18.9272 }
};

export default function IncineratorCoordinatesUpdater() {
    const [isMounted, setIsMounted] = useState(false);
    const [incinerators, setIncinerators] = useState<IncineratorUpdate[]>([]);
    const [activeIncinerator, setActiveIncinerator] = useState<string | null>(null);
    const [updatedCode, setUpdatedCode] = useState<string>('');
    const [showUpdatedCode, setShowUpdatedCode] = useState(false); useEffect(() => {
        setIsMounted(true);

        // Připrav data spaloven pro aktualizaci
        const incineratorUpdates: IncineratorUpdate[] = incineratorData.map(inc => {
            const reference = referenceCoordinates[inc.name];
            const distanceInMeters = reference ?
                calculateDistance(inc.location.lat, inc.location.lng, reference.lat, reference.lng) : 0;

            return {
                id: inc.id,
                name: inc.name,
                currentLocation: { ...inc.location },
                referenceLocation: reference || { lat: 0, lng: 0 },
                distanceInMeters,
                needsUpdate: distanceInMeters > 10, // Pokud je vzdálenost větší než 10 metrů, potřebuje aktualizaci
                selected: distanceInMeters > 10 // Automaticky vyber spalovny, které potřebují aktualizaci
            };
        });

        setIncinerators(incineratorUpdates);
    }, []);

    // Funkce pro měření vzdálenosti mezi dvěma body v metrech
    const calculateDistance = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ) => {
        const R = 6371e3; // Poloměr Země v metrech
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return Math.round(distance);
    };

    const toggleSelection = (id: string) => {
        setIncinerators(incinerators.map(inc =>
            inc.id === id ? { ...inc, selected: !inc.selected } : inc
        ));
    };

    const handleSelectAll = () => {
        setIncinerators(incinerators.map(inc => ({ ...inc, selected: true })));
    };

    const handleSelectNone = () => {
        setIncinerators(incinerators.map(inc => ({ ...inc, selected: false })));
    };

    const handleSelectNeedsUpdate = () => {
        setIncinerators(incinerators.map(inc => ({ ...inc, selected: inc.needsUpdate })));
    };

    const handleGenerateUpdateCode = () => {
        const selectedIncinerators = incinerators.filter(inc => inc.selected);

        if (selectedIncinerators.length === 0) {
            alert('Vyberte alespoň jednu spalovnu pro aktualizaci');
            return;
        }

        // Generuj kód pro aktualizaci
        let code = `// Aktualizace souřadnic spaloven\n`;
        code += `// Při kopírování do souboru src/data/incinerators.ts nahraďte pouze odpovídající souřadnice\n\n`;

        selectedIncinerators.forEach(inc => {
            code += `// ${inc.name} (ID: ${inc.id})\n`;
            code += `location: {\n`;
            code += `  lat: ${inc.referenceLocation.lat},\n`;
            code += `  lng: ${inc.referenceLocation.lng},\n`;
            code += `},\n\n`;
        });

        // Generuj kód pro aktualizaci celého datového souboru
        code += `// Alternativně můžete použít tento kód pro aktualizaci celého datového pole:\n\n`;
        code += `export const incineratorData: Incinerator[] = [\n`;

        incineratorData.forEach((inc, index) => {
            const selected = selectedIncinerators.find(s => s.id === inc.id);
            const locationToUse = selected ? selected.referenceLocation : inc.location;

            code += `{\n`;
            code += `  id: '${inc.id}',\n`;
            code += `  name: '${inc.name}',\n`;
            code += `  location: {\n`;
            code += `    lat: ${locationToUse.lat},\n`;
            code += `    lng: ${locationToUse.lng},\n`;
            code += `  },\n`;

            // Kopíruj další vlastnosti z původního objektu
            if (inc.description) code += `  description: '${inc.description}',\n`;
            if (inc.capacity) code += `  capacity: ${inc.capacity},\n`;
            code += `  operational: ${inc.operational},\n`;
            if (inc.yearEstablished) code += `  yearEstablished: ${inc.yearEstablished},\n`;

            // Pokud je to poslední záznam, vynech čárku
            code += `  // Další vlastnosti jako propertyBoundary, buildings, atd. vynechány pro přehlednost\n`;
            code += `}${index < incineratorData.length - 1 ? ',' : ''}\n`;
        });

        code += `];\n\n`;
        code += `export default incineratorData;\n`;

        setUpdatedCode(code);
        setShowUpdatedCode(true);
    };

    const handleGeneratePolygonSyncCode = () => {
        const selectedIncinerators = incinerators.filter(inc => inc.selected);

        if (selectedIncinerators.length === 0) {
            alert('Vyberte alespoň jednu spalovnu pro aktualizaci polygonů');
            return;
        }

        // Generuj instrukce pro synchronizaci polygonů
        let code = `// Postup pro synchronizaci polygonů s novými souřadnicemi:\n\n`;
        code += `1. Otevřete nástroj "Synchronizace polygonů" v aplikaci (http://localhost:3000/polygon-sync)\n`;
        code += `2. Pro každou spalovnu proveďte:\n`;

        selectedIncinerators.forEach(inc => {
            code += `   - Vyberte spalovnu "${inc.name}"\n`;
            code += `   - Zkontrolujte, zda jsou nové souřadnice (${inc.referenceLocation.lat}, ${inc.referenceLocation.lng}) správně zobrazeny\n`;
            code += `   - Klikněte na tlačítko "Synchronizovat polygony"\n`;
            code += `   - Zkontrolujte výsledek na mapě, zda jsou polygony správně zarovnány\n\n`;
        });

        code += `3. Po úspěšné synchronizaci všech spaloven exportujte aktualizovaná data pomocí tlačítka "Exportovat GeoJSON"\n`;
        code += `4. Aktualizovaná data zkopírujte do souboru src/data/incinerators.ts\n`;

        setUpdatedCode(code);
        setShowUpdatedCode(true);
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(updatedCode)
            .then(() => alert('Kód zkopírován do schránky'))
            .catch(err => console.error('Chyba při kopírování do schránky', err));
    }; if (!isMounted) {
        return <div className="h-[500px] w-full bg-gray-100 flex items-center justify-center text-gray-500">Načítání...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Hromadná aktualizace souřadnic spaloven</h1>

            <div className="mb-4">
                <Link href="/" className="text-blue-500 hover:underline">
                    ← Zpět na hlavní stránku
                </Link>
            </div>

            <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">O nástroji</h2>
                <p>
                    Tento nástroj slouží k hromadné aktualizaci souřadnic spaloven podle referenčních dat.
                    Vyberte spalovny, které chcete aktualizovat, a nástroj vygeneruje kód, který můžete použít
                    k aktualizaci dat v souboru <code>src/data/incinerators.ts</code>.
                </p>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Seznam spaloven</h2>

                <div className="mb-2 flex space-x-2">
                    <button
                        onClick={handleSelectAll}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
                    >
                        Vybrat vše
                    </button>
                    <button
                        onClick={handleSelectNone}
                        className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition"
                    >
                        Zrušit výběr
                    </button>
                    <button
                        onClick={handleSelectNeedsUpdate}
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition"
                    >
                        Vybrat potřebující aktualizaci
                    </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Výběr
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Název
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aktuální souřadnice
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Referenční souřadnice
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vzdálenost
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stav
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Akce
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {incinerators.map(inc => (
                                <tr key={inc.id} className={inc.needsUpdate ? 'bg-yellow-50' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            checked={inc.selected}
                                            onChange={() => toggleSelection(inc.id)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {inc.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {inc.currentLocation.lat.toFixed(7)}, {inc.currentLocation.lng.toFixed(7)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {inc.referenceLocation.lat.toFixed(7)}, {inc.referenceLocation.lng.toFixed(7)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {inc.distanceInMeters} m
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {inc.needsUpdate ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                Potřebuje aktualizaci
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                OK
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            onClick={() => setActiveIncinerator(inc.id)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            Zobrazit na mapě
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>            {activeIncinerator && (
                <IncineratorMap
                    activeIncinerator={incinerators.find(inc => inc.id === activeIncinerator) || null}
                />
            )}

            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={handleGenerateUpdateCode}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Generovat kód pro aktualizaci souřadnic
                </button>

                <button
                    onClick={handleGeneratePolygonSyncCode}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                    Generovat instrukce pro synchronizaci polygonů
                </button>
            </div>

            {showUpdatedCode && (
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-semibold">Vygenerovaný kód / instrukce</h2>
                        <button
                            onClick={handleCopyToClipboard}
                            className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition"
                        >
                            Kopírovat do schránky
                        </button>
                    </div>
                    <div className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-auto" style={{ maxHeight: '400px' }}>
                        <pre className="text-sm">
                            {updatedCode}
                        </pre>
                    </div>
                </div>
            )}

            <div className="mt-8 bg-blue-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Postup aktualizace dat</h2>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Vyberte spalovny, které chcete aktualizovat (označte je zaškrtnutím)</li>                    <li>Klikněte na &quot;Generovat kód pro aktualizaci souřadnic&quot;</li>
                    <li>Zkopírujte vygenerovaný kód do schránky</li>
                    <li>Otevřete soubor <code>src/data/incinerators.ts</code></li>
                    <li>Nahraďte příslušné části kódu vygenerovaným kódem</li>
                    <li>Uložte soubor a zkontrolujte výsledek v aplikaci</li>
                    <li>Pro aktualizaci polygonů postupujte podle instrukcí v &quot;Generovat instrukce pro synchronizaci polygonů&quot;</li>
                </ol>
            </div>
        </div>
    );
}
