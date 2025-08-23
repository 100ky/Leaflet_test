/**
 * DeveloperPanel.tsx - Vývojářský panel pro testování a ladění
 * Umožňuje ovládání simulací API, testování chyb a monitorování výkonu
 */

'use client';

import { useState } from 'react';
import { toggleErrorSimulation, getApiSimulationConfig } from '@/services/incineratorApi';
import { logger } from '@/utils/logger';

interface DeveloperPanelProps {
    onClose?: () => void;
}

const DeveloperPanel = ({ onClose }: DeveloperPanelProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [simulationConfig, setSimulationConfig] = useState(getApiSimulationConfig());
    const [testResults, setTestResults] = useState<string[]>([]);

    // Aktualizace konfigurace
    const updateConfig = () => {
        setSimulationConfig(getApiSimulationConfig());
    };

    // Toggle error simulation
    const handleToggleErrorSimulation = () => {
        const newState = !simulationConfig.ENABLE_ERROR_SIMULATION;
        toggleErrorSimulation(newState);
        updateConfig();

        const message = `API error simulation ${newState ? 'enabled' : 'disabled'}`;
        setTestResults(prev => [...prev, message]);
        logger.info(message);
    };

    // Test error handling
    const handleTestError = () => {
        try {
            throw new Error('Test error for developer panel');
        } catch (error) {
            const message = `Test error thrown: ${error instanceof Error ? error.message : 'Unknown error'}`;
            setTestResults(prev => [...prev, message]);
            logger.error(message);
        }
    };

    // Clear test results
    const handleClearResults = () => {
        setTestResults([]);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-3 right-3 bg-purple-500 text-white p-2 rounded-full shadow-lg hover:bg-purple-600 transition-colors z-[1001]"
                title="Open Developer Panel"
            >
                🛠️
            </button>
        );
    }

    return (
        <div className="fixed bottom-3 right-3 bg-white rounded-lg shadow-2xl border border-gray-200 z-[1001] w-80 max-h-96 overflow-y-auto">
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">🛠️ Developer Panel</h3>
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onClose?.();
                        }}
                        className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* API Simulation Controls */}
                <div className="space-y-3 mb-4">
                    <h4 className="font-medium text-gray-700">API Simulation</h4>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Error Simulation:</span>
                        <button
                            onClick={handleToggleErrorSimulation}
                            className={`px-3 py-1 text-xs rounded transition-colors ${simulationConfig.ENABLE_ERROR_SIMULATION
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                                }`}
                        >
                            {simulationConfig.ENABLE_ERROR_SIMULATION ? 'ON' : 'OFF'}
                        </button>
                    </div>

                    <div className="text-xs text-gray-700 space-y-1">
                        <div>Error Rate: {(simulationConfig.ERROR_RATE * 100).toFixed(1)}%</div>
                        <div>Slow Request Rate: {(simulationConfig.SLOW_REQUEST_RATE * 100).toFixed(1)}%</div>
                    </div>
                </div>

                {/* Test Controls */}
                <div className="space-y-3 mb-4">
                    <h4 className="font-medium text-gray-700">Testing</h4>

                    <div className="space-y-2">
                        <button
                            onClick={handleTestError}
                            className="w-full px-3 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                        >
                            Test Error Handling
                        </button>

                        <button
                            onClick={handleClearResults}
                            className="w-full px-3 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                        >
                            Clear Results
                        </button>
                    </div>
                </div>

                {/* Test Results */}
                {testResults.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-medium text-gray-700">Results</h4>
                        <div className="bg-gray-50 p-2 rounded text-xs max-h-32 overflow-y-auto">
                            {testResults.map((result, index) => (
                                <div key={index} className="mb-1 text-gray-600">
                                    {new Date().toLocaleTimeString()}: {result}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Performance Info */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-2">Performance</h4>
                    <div className="text-xs text-gray-700 space-y-1">
                        <div>Memory: {(performance as unknown as { memory?: { usedJSHeapSize: number } }).memory ?
                            `${Math.round((performance as unknown as { memory: { usedJSHeapSize: number } }).memory.usedJSHeapSize / 1024 / 1024)}MB` :
                            'N/A'}
                        </div>
                        <div>Navigation: {performance.navigation.type === 0 ? 'Navigate' :
                            performance.navigation.type === 1 ? 'Reload' : 'Back/Forward'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeveloperPanel;
