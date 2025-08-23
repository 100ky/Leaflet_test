/**
 * Panel pro testování API a načítání dat spaloven
 * 
 * Umožňuje vývojářům testovat:
 * - Dynamické načítání dat podle map bounds
 * - Přednastavené testovací regiony
 * - Různé zoom úrovně a jejich vliv na data
 * - API response časy a chování
 * 
 * Obsahuje ovládací prvky pro manuální testování API endpointů.
 * 
 * @component
 */

'use client';

import { useState } from 'react';
import { useIncineratorData } from '@/hooks/useIncineratorData';
import { MapBounds } from '@/services/incineratorApi';
import { TEST_REGIONS } from '@/constants/regions';
import { Panel } from '../ui/Panel';
import { InfoBlock } from '../ui/InfoBlock';

export const ApiTestPanel = () => {
    const [testBounds, setTestBounds] = useState<MapBounds>({
        north: 50.5,
        south: 49.5,
        east: 15.5,
        west: 14.0
    });
    const [testZoom, setTestZoom] = useState(10);

    const {
        incinerators,
        loading,
        error,
        totalCount,
        clustered,
        usingRemoteApi,
        updateViewport,
        refetch,
        switchToRemoteApi,
        switchToLocalApi
    } = useIncineratorData({
        enablePrefetch: true,
        useRemoteApi: false
    });

    const handleTestViewport = () => {
        updateViewport(testBounds, testZoom);
    };

    return (
        <Panel
            title="API Test Panel"
            className="panel-main" // Zachování původní třídy
            isCollapsible={false} // Tento panel není ve výchozím stavu rozbalovací
        >
            {/* Status */}
            <div className="stats-grid">
                <InfoBlock
                    label="Stav"
                    value={loading ? 'Načítá...' : 'Připraven'}
                    valueClassName={loading ? 'text-orange-600' : 'text-green-600'}
                    className="bg-gray-50 p-3 rounded"
                />
                <InfoBlock
                    label="Zdroj dat"
                    value={usingRemoteApi ? 'Vzdálené API' : 'Lokální data'}
                    valueClassName={usingRemoteApi ? 'text-blue-600' : 'text-purple-600'}
                    className="bg-gray-50 p-3 rounded"
                />
                <InfoBlock
                    label="Spalovny"
                    value={`${incinerators.length} / ${totalCount}`}
                    valueClassName="text-gray-800"
                    className="bg-gray-50 p-3 rounded"
                />
                <InfoBlock
                    label="Clustering"
                    value={clustered ? 'Aktivní' : 'Neaktivní'}
                    valueClassName={clustered ? 'text-blue-600' : 'text-gray-600'}
                    className="bg-gray-50 p-3 rounded"
                />
            </div>

            {/* Error display */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
                    <div className="font-medium">Chyba:</div>
                    <div>{error}</div>
                </div>
            )}

            {/* API controls */}
            <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Ovládání API</h3>
                <div className="flex-buttons">
                    <button
                        onClick={switchToLocalApi}
                        disabled={loading || !usingRemoteApi}
                        className="btn-base bg-purple-500 hover:bg-purple-600 disabled:opacity-50"
                    >
                        Lokální data
                    </button>
                    <button
                        onClick={switchToRemoteApi}
                        disabled={loading || usingRemoteApi}
                        className="btn-base bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
                    >
                        Vzdálené API
                    </button>
                    <button
                        onClick={refetch}
                        disabled={loading}
                        className="btn-base bg-green-500 hover:bg-green-600 disabled:opacity-50"
                    >
                        Obnovit
                    </button>
                </div>
            </div>

            {/* Viewport testing */}
            <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Testování viewport</h3>

                {/* Predefined bounds */}
                <div className="button-grid">
                    {TEST_REGIONS.map((preset) => (
                        <button
                            key={preset.name}
                            onClick={() => updateViewport(preset.bounds, preset.zoom)}
                            disabled={loading}
                            className="btn-base btn-secondary"
                        >
                            {preset.name}
                        </button>
                    ))}
                </div>

                {/* Custom bounds */}
                <div className="border-t pt-3">
                    <div className="grid grid-cols-2 gap-3">                    <div>
                        <label className="block text-sm text-gray-700 font-medium">Sever</label>
                        <input
                            type="number"
                            step="0.1"
                            value={testBounds.north}
                            onChange={(e) => setTestBounds(prev => ({ ...prev, north: parseFloat(e.target.value) }))}
                            className="input-base"
                        />
                    </div>
                        <div>
                            <label className="block text-sm text-gray-700 font-medium">Jih</label>
                            <input
                                type="number"
                                step="0.1"
                                value={testBounds.south}
                                onChange={(e) => setTestBounds(prev => ({ ...prev, south: parseFloat(e.target.value) }))}
                                className="input-base"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 font-medium">Východ</label>
                            <input
                                type="number"
                                step="0.1"
                                value={testBounds.east}
                                onChange={(e) => setTestBounds(prev => ({ ...prev, east: parseFloat(e.target.value) }))}
                                className="input-base"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 font-medium">Západ</label>
                            <input
                                type="number"
                                step="0.1"
                                value={testBounds.west}
                                onChange={(e) => setTestBounds(prev => ({ ...prev, west: parseFloat(e.target.value) }))}
                                className="input-base"
                            />
                        </div>
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm text-gray-700 font-medium">Zoom</label>
                        <input
                            type="number"
                            min="1"
                            max="18"
                            value={testZoom}
                            onChange={(e) => setTestZoom(parseInt(e.target.value))}
                            className="input-base"
                        />
                    </div>
                    <button
                        onClick={handleTestViewport}
                        disabled={loading}
                        className="btn-base btn-primary w-full mt-2"
                    >
                        Test viewport
                    </button>
                </div>
            </div>

            {/* Incinerators list */}
            <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Načtené spalovny ({incinerators.length})</h3>
                <div className="max-h-40 overflow-y-auto space-y-1">
                    {incinerators.map((inc) => (
                        <div key={inc.id} className="text-sm bg-gray-50 p-2 rounded">
                            <div className="font-medium text-gray-800">{inc.name}</div>
                            <div className="text-gray-700">
                                {inc.location.lat.toFixed(4)}, {inc.location.lng.toFixed(4)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Panel>
    );
};
