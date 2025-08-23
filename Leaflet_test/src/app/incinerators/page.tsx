'use client';

import Navigation from '@/components/ui/Navigation';
import { useIncineratorDataContext } from '@/contexts/IncineratorDataContext';
import { IncineratorDataProvider } from '@/contexts/IncineratorDataContext';
import { Incinerator } from '@/types';
import { useState } from 'react';

function IncineratorsContent() {
    const {
        incinerators,
        loading,
        error,
        totalCount,
        usingRemoteApi,
        switchToRemoteApi,
        switchToLocalApi,
        refetch
    } = useIncineratorDataContext();

    const [filter, setFilter] = useState<'all' | 'operational' | 'planned' | 'closed'>('all');

    const filteredIncinerators = incinerators.filter(inc => {
        switch (filter) {
            case 'operational':
                return inc.operational;
            case 'planned':
                return !inc.operational && inc.name?.toLowerCase().includes('plán');
            case 'closed':
                return !inc.operational && !inc.name?.toLowerCase().includes('plán');
            default:
                return true;
        }
    });

    const getStatusBadge = (incinerator: Incinerator) => {
        if (incinerator.operational) {
            return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">V provozu</span>;
        } else if (incinerator.name?.toLowerCase().includes('plán')) {
            return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Plánovaná</span>;
        } else {
            return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Mimo provoz</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            {/* Hero sekce */}
            <section className="bg-gray-900 text-white py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-6">
                            Seznam <span className="text-green-400">spaloven</span>
                        </h1>
                        <p className="text-lg text-gray-300">
                            Kompletní přehled všech spaloven odpadu v České republice
                        </p>
                    </div>
                </div>
            </section>

            {/* Ovládací panel */}
            <section className="py-8 bg-white border-b">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Filtry */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                Všechny ({incinerators.length})
                            </button>
                            <button
                                onClick={() => setFilter('operational')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'operational' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                V provozu
                            </button>
                            <button
                                onClick={() => setFilter('planned')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'planned' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                Plánované
                            </button>
                            <button
                                onClick={() => setFilter('closed')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'closed' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                Mimo provoz
                            </button>
                        </div>

                        {/* API přepínač */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Zdroj dat:</span>
                            <button
                                onClick={switchToLocalApi}
                                disabled={loading}
                                className={`px-3 py-1 text-xs rounded transition-colors ${!usingRemoteApi
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Lokální
                            </button>
                            <button
                                onClick={switchToRemoteApi}
                                disabled={loading}
                                className={`px-3 py-1 text-xs rounded transition-colors ${usingRemoteApi
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Vzdálené
                            </button>
                            <button
                                onClick={refetch}
                                disabled={loading}
                                className={`px-3 py-1 text-xs rounded transition-colors bg-orange-500 text-white hover:bg-orange-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {loading ? 'Načítá...' : 'Obnovit'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Seznam spaloven */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-4">
                    {loading && (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center space-x-2">
                                <div className="animate-spin w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                                <span className="text-gray-600">Načítání dat...</span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center space-x-2">
                                <span className="text-red-500">❌</span>
                                <span className="text-red-700">{error}</span>
                            </div>
                        </div>
                    )}

                    {!loading && !error && filteredIncinerators.length === 0 && (
                        <div className="text-center py-8">
                            <span className="text-gray-500">Žádné spalovny neodpovídají zadaným kritériím</span>
                        </div>
                    )}

                    <div className="grid gap-6">
                        {filteredIncinerators.map((incinerator) => (
                            <div key={incinerator.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="text-xl font-semibold text-gray-900 truncate">
                                                    {incinerator.name || `Spalovna ${incinerator.id}`}
                                                </h3>
                                                {getStatusBadge(incinerator)}
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                                                <div className="space-y-2">
                                                    <div className="flex items-center space-x-2">
                                                        <span>📍</span>
                                                        <span>
                                                            {incinerator.location.lat.toFixed(6)}, {incinerator.location.lng.toFixed(6)}
                                                        </span>
                                                    </div>
                                                    {incinerator.capacity && (
                                                        <div className="flex items-center space-x-2">
                                                            <span>⚖️</span>
                                                            <span>Kapacita: {incinerator.capacity.toLocaleString()} t/rok</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    {incinerator.officialInfo?.technology && (
                                                        <div className="flex items-center space-x-2">
                                                            <span>⚙️</span>
                                                            <span>Technologie: {incinerator.officialInfo.technology}</span>
                                                        </div>
                                                    )}
                                                    {incinerator.officialInfo?.operator && (
                                                        <div className="flex items-center space-x-2">
                                                            <span>🏢</span>
                                                            <span>Provozovatel: {incinerator.officialInfo.operator}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {incinerator.description && (
                                                <div className="mt-3 text-sm text-gray-600">
                                                    <p>{incinerator.description}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-shrink-0">
                                            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                                                Zobrazit na mapě
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Statistiky */}
                    {!loading && !error && (
                        <div className="mt-12 grid md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                                <div className="text-3xl font-bold text-gray-900">{totalCount}</div>
                                <div className="text-sm text-gray-600">Celkem spaloven</div>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                                <div className="text-3xl font-bold text-green-600">
                                    {incinerators.filter(i => i.operational).length}
                                </div>
                                <div className="text-sm text-gray-600">V provozu</div>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                                <div className="text-3xl font-bold text-blue-600">
                                    {incinerators.filter(i => !i.operational).length}
                                </div>
                                <div className="text-sm text-gray-600">Mimo provoz / Plánované</div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center text-gray-400">
                        <p>&copy; 2025 České spalovny | Projekt pro mapování spaloven v České republice</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default function IncineratorsPage() {
    return (
        <IncineratorDataProvider>
            <IncineratorsContent />
        </IncineratorDataProvider>
    );
}