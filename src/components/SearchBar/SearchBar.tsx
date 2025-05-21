'use client';

import { useState } from 'react';
import { NominatimService } from '@/services/NominatimService';

interface SearchBarProps {
    onSearch: (lat: number, lng: number) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [address, setAddress] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!address.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const service = new NominatimService();
            const coordinates = await service.geocodeAddress(address);

            onSearch(coordinates.lat, coordinates.lng);
        } catch (err) {
            setError('Adresa nebyla nalezena. Zkuste prosím zadat přesnější údaje.');
            console.error('Error during geocoding:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mb-4">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    className="px-4 py-2 border border-gray-300 rounded-md flex-grow"
                    placeholder="Zadejte adresu nebo název místa..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    disabled={isLoading}
                >
                    {isLoading ? 'Vyhledávání...' : 'Vyhledat'}
                </button>
            </form>

            {error && (
                <div className="mt-2 text-red-500">
                    {error}
                </div>
            )}
        </div>
    );
}
