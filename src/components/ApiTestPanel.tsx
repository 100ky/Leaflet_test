/**
 * Demonstrační komponenta pro testování dynamického načítání dat
 */

'use client';

import React, { useState } from 'react';
import { useIncineratorData } from '@/hooks/useIncineratorData';
import { MapBounds } from '@/services/incineratorApi';

export const ApiTestPanel: React.FC = () => {
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

    const predefinedBounds = [
        {
            name: 'Praha oblast',
            bounds: { north: 50.2, south: 49.9, east: 14.7, west: 14.2 },
            zoom: 11
        },
        {
            name: 'Brno oblast',
            bounds: { north: 49.3, south: 49.1, east: 16.8, west: 16.5 },
            zoom: 11
        },
        {
            name: 'Celá ČR',
            bounds: { north: 51.1, south: 48.5, east: 18.9, west: 12.1 },
            zoom: 7
        },
        {
            name: 'Severní Čechy',
            bounds: { north: 50.9, south: 50.4, east: 15.2, west: 13.8 },
            zoom: 9
        }
    ]; return (
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">API Test Panel</h2>

            {/* Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gray-50 p-3 rounded">
                    <div className="text-xs sm:text-sm text-gray-600">Stav</div>
                    <div className={`font-medium text-sm sm:text-base ${loading ? 'text-orange-600' : 'text-green-600'}`}>
                        {loading ? 'Načítá...' : 'Připraven'}
                    </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                    <div className="text-xs sm:text-sm text-gray-600">Zdroj dat</div>
                    <div className={`font-medium text-sm sm:text-base ${usingRemoteApi ? 'text-blue-600' : 'text-purple-600'}`}>
                        {usingRemoteApi ? 'Vzdálené API' : 'Lokální data'}
                    </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                    <div className="text-xs sm:text-sm text-gray-600">Spalovny</div>
                    <div className="font-medium text-sm sm:text-base text-gray-800">
                        {incinerators.length} / {totalCount}
                    </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                    <div className="text-xs sm:text-sm text-gray-600">Clustering</div>
                    <div className={`font-medium text-sm sm:text-base ${clustered ? 'text-blue-600' : 'text-gray-400'}`}>
                        {clustered ? 'Aktivní' : 'Neaktivní'}
                    </div>
                </div>
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
                <div className="flex space-x-3">
                    <button
                        onClick={switchToLocalApi}
                        disabled={loading || !usingRemoteApi}
                        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
                    >
                        Lokální data
                    </button>
                    <button
                        onClick={switchToRemoteApi}
                        disabled={loading || usingRemoteApi}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        Vzdálené API
                    </button>
                    <button
                        onClick={refetch}
                        disabled={loading}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    >
                        Obnovit
                    </button>
                </div>
            </div>

            {/* Viewport testing */}
            <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Testování viewport</h3>

                {/* Predefined bounds */}
                <div className="grid grid-cols-2 gap-2">
                    {predefinedBounds.map((preset) => (
                        <button
                            key={preset.name}
                            onClick={() => updateViewport(preset.bounds, preset.zoom)}
                            disabled={loading}
                            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                        >
                            {preset.name}
                        </button>
                    ))}
                </div>

                {/* Custom bounds */}
                <div className="border-t pt-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm text-gray-600">Sever</label>
                            <input
                                type="number"
                                step="0.1"
                                value={testBounds.north}
                                onChange={(e) => setTestBounds(prev => ({ ...prev, north: parseFloat(e.target.value) }))}
                                className="w-full px-2 py-1 border rounded text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Jih</label>
                            <input
                                type="number"
                                step="0.1"
                                value={testBounds.south}
                                onChange={(e) => setTestBounds(prev => ({ ...prev, south: parseFloat(e.target.value) }))}
                                className="w-full px-2 py-1 border rounded text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Východ</label>
                            <input
                                type="number"
                                step="0.1"
                                value={testBounds.east}
                                onChange={(e) => setTestBounds(prev => ({ ...prev, east: parseFloat(e.target.value) }))}
                                className="w-full px-2 py-1 border rounded text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Západ</label>
                            <input
                                type="number"
                                step="0.1"
                                value={testBounds.west}
                                onChange={(e) => setTestBounds(prev => ({ ...prev, west: parseFloat(e.target.value) }))}
                                className="w-full px-2 py-1 border rounded text-sm"
                            />
                        </div>
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm text-gray-600">Zoom</label>
                        <input
                            type="number"
                            min="1"
                            max="18"
                            value={testZoom}
                            onChange={(e) => setTestZoom(parseInt(e.target.value))}
                            className="w-full px-2 py-1 border rounded text-sm"
                        />
                    </div>
                    <button
                        onClick={handleTestViewport}
                        disabled={loading}
                        className="mt-2 w-full px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
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
                            <div className="font-medium">{inc.name}</div>
                            <div className="text-gray-600">
                                {inc.location.lat.toFixed(4)}, {inc.location.lng.toFixed(4)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
