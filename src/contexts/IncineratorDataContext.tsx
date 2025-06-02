/**
 * IncineratorDataContext - React Context pro správu dat spaloven
 * Poskytuje centralizované úložiště pro data spaloven, stav načítání a ovládání API
 */

'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Incinerator } from '@/types';
import { useIncineratorData } from '@/hooks/useIncineratorData';
import { MapBounds } from '@/services/incineratorApi';

/**
 * Typ pro kontext dat spaloven
 */

interface IncineratorDataContextType {
    incinerators: Incinerator[];
    loading: boolean;
    error: string | null;
    totalCount: number;
    clustered: boolean;
    usingRemoteApi: boolean;
    currentRegion: string;
    updateViewport: (bounds: MapBounds, zoom: number) => void;
    refetch: () => void;
    switchToRemoteApi: () => void;
    switchToLocalApi: () => void;
    flyToRegion: (bounds: MapBounds, zoom: number) => void;
}

const IncineratorDataContext = createContext<IncineratorDataContextType | undefined>(undefined);

interface IncineratorDataProviderProps {
    children: ReactNode;
    enablePrefetch?: boolean;
    useRemoteApi?: boolean;
}

export const IncineratorDataProvider: React.FC<IncineratorDataProviderProps> = ({
    children,
    enablePrefetch = true,
    useRemoteApi = false
}) => {
    const hookData = useIncineratorData({
        enablePrefetch,
        useRemoteApi
    });

    return (
        <IncineratorDataContext.Provider value={hookData}>
            {children}
        </IncineratorDataContext.Provider>
    );
};

export const useIncineratorDataContext = () => {
    const context = useContext(IncineratorDataContext);
    if (context === undefined) {
        throw new Error('useIncineratorDataContext must be used within a IncineratorDataProvider');
    }
    return context;
};
