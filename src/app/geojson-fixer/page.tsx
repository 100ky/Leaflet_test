'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { incineratorData } from '@/data/incinerators';

// Pokud potřebujeme práci s mapou, musíme importovat dynamicky
const GeojsonFixerMap = dynamic(() => import('../../components/Map/GeojsonFixerMap'), {
    ssr: false,
});

export default function GeojsonFixer() {
    const [selectedIncinerator, setSelectedIncinerator] = useState('1'); // ZEVO Malešice

    // Najděme vybranou spalovnu
    const incinerator = incineratorData.find(inc => inc.id === selectedIncinerator);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedIncinerator(e.target.value);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Vizualizace a oprava GeoJSON souřadnic</h1>

            <div className="mb-4">
                <Link href="/" className="text-blue-500 hover:underline">
                    ← Zpět na hlavní stránku
                </Link>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <h2 className="text-lg font-bold mb-2">Vybraná spalovna</h2>
                <select
                    value={selectedIncinerator}
                    onChange={handleSelectChange}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                >
                    {incineratorData.map(inc => (
                        <option key={inc.id} value={inc.id}>{inc.name}</option>
                    ))}
                </select>

                {incinerator && (
                    <div className="mb-4">
                        <h3 className="font-bold">{incinerator.name}</h3>
                        <p>{incinerator.description}</p>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <p><strong>Zeměpisná šířka (lat):</strong> {incinerator.location.lat}</p>
                            </div>
                            <div>
                                <p><strong>Zeměpisná délka (lng):</strong> {incinerator.location.lng}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <h2 className="text-lg font-bold mb-4">Vizualizace GeoJSON objektů</h2>

                {incinerator ? (
                    <div style={{ height: '600px', width: '100%' }}>
                        <GeojsonFixerMap incinerator={incinerator} />
                    </div>
                ) : (
                    <p>Vyberte spalovnu pro zobrazení na mapě.</p>
                )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="text-lg font-bold mb-2">Jak opravit souřadnice GeoJSON objektů?</h2>

                <div className="text-sm">
                    <p className="mb-2">GeoJSON používá pořadí souřadnic [longitude, latitude] (opačně než většina map):</p>

                    <div className="bg-gray-100 p-2 rounded mb-4">
                        <pre className="text-xs overflow-auto">
                            {`// Pořadí souřadnic v GeoJSON je [longitude, latitude]
"geometry": {
  "type": "Polygon",
  "coordinates": [[
    [14.540570, 50.079655], // [lng, lat]
    [14.541570, 50.079655],
    [14.541570, 50.080655],
    [14.540570, 50.080655],
    [14.540570, 50.079655]
  ]]
}`}
                        </pre>
                    </div>

                    <p className="mb-2">Časté problémy s GeoJSON objekty:</p>
                    <ol className="list-decimal list-inside mb-4">
                        <li>Prohozené souřadnice (lat a lng v nesprávném pořadí)</li>
                        <li>Nepřesné souřadnice (souřadnice neodpovídají skutečné poloze)</li>
                        <li>Chybějící uzavření polygonu (první a poslední bod nejsou stejné)</li>
                        <li>Souřadnice mimo rozsah spalovny (budova je příliš daleko od hlavní lokace)</li>
                    </ol>

                    <p className="mb-2">Kroky pro opravu:</p>
                    <ol className="list-decimal list-inside">
                        <li>Použijte nástroj <Link href="/coordinate-converter" className="text-blue-500 hover:underline">Konverze souřadnic</Link> pro získání správných hodnot</li>
                        <li>Upravte soubor <code>src/data/incinerators.ts</code> s novými souřadnicemi</li>
                        <li>Pro hromadné aktualizace použijte <Link href="/geojson-updater" className="text-blue-500 hover:underline">GeoJSON aktualizace</Link></li>
                        <li>Nezapomeňte, že v GeoJSON je pořadí [longitude, latitude]</li>
                        <li>Ujistěte se, že polygony jsou uzavřené (první a poslední bod jsou identické)</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
