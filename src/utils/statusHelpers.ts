/**
 * Utility funkce pro status indikátory a UI vzory
 * 
 * Centralizuje opakující se logiku pro:
 * - API status ikony a texty
 * - Loading stavy a indikátory
 * - Zdroj dat a připojení status
 * - Barevné kódování stavů
 * - Konzistentní UI patterny napříč komponentami
 * 
 * @module statusHelpers
 */

/**
 * Utility funkce pro API status
 */
export interface ApiStatusState {
    loading: boolean;
    error: string | null;
    usingRemoteApi: boolean;
}

export const getApiStatusIcon = (state: ApiStatusState): string => {
    if (state.loading) return '⏳';
    if (state.error) return '❌';
    if (state.usingRemoteApi) return '🌐';
    return '🏠';
};

export const getApiStatusText = (state: ApiStatusState): string => {
    if (state.loading) return 'Načítá...';
    if (state.error) return 'Chyba připojení';
    if (state.usingRemoteApi) return 'Vzdálené API aktivní';
    return 'Lokální API aktivní';
};

export const getApiStatusColor = (state: ApiStatusState): string => {
    if (state.loading) return 'text-blue-600';
    if (state.error) return 'text-red-600';
    if (state.usingRemoteApi) return 'text-green-600';
    return 'text-gray-600';
};

/**
 * Data source utilities
 */
export const getDataSourceIcon = (state: ApiStatusState): string => {
    if (state.loading) return '⏳';
    if (state.error) return '❌';
    return state.usingRemoteApi ? '🌐' : '🏠';
};

export const getDataSourceText = (state: ApiStatusState): string => {
    if (state.loading) return 'Načítání...';
    if (state.error) return 'Chyba dat';
    return state.usingRemoteApi ? 'Vzdálená data' : 'Lokální data';
};

/**
 * Expand/collapse icon utility
 */
export const getExpandIcon = (expanded: boolean): string => {
    return expanded ? '▼' : '▶';
};

/**
 * Loading indicator utilities
 */
export const getLoadingStateClass = (loading: boolean, error: string | null): string => {
    if (loading) return 'bg-yellow-400 animate-pulse';
    if (error) return 'bg-red-400';
    return 'bg-green-400';
};

export const getLoadingStateText = (loading: boolean, error: string | null): string => {
    if (loading) return 'Načítám...';
    if (error) return 'Chyba';
    return 'OK';
};

/**
 * Button state utilities
 */
export const getButtonLoadingIcon = (loading: boolean): string => {
    return loading ? '🔄' : '🔍';
};

export const getButtonLoadingText = (loading: boolean, defaultText: string): string => {
    return loading ? 'Testuje...' : defaultText;
};

/**
 * Test result utilities
 */
export const getTestResultIcon = (success: boolean): string => {
    return success ? '✅ Úspěšné' : '❌ Neúspěšné';
};

/**
 * API source type utilities  
 */
export const getApiSourceIcon = (source: 'local' | 'remote'): string => {
    return source === 'remote' ? '🌐' : '🏠';
};

export const getApiSourceName = (source: 'local' | 'remote'): string => {
    return source === 'remote' ? 'Vzdálené API' : 'Lokální API';
};

/**
 * Log type utilities
 */
export type LogType = 'info' | 'success' | 'warning' | 'error' | 'debug' | 'api' | 'system' | 'loading';

export const getLogIcon = (type: LogType): string => {
    switch (type) {
        case 'info':
            return 'ℹ️';
        case 'success':
            return '✅';
        case 'warning':
            return '⚠️';
        case 'error':
            return '❌';
        case 'debug':
            return '🔍';
        case 'api':
            return '📡';
        case 'system':
            return '⚙️';
        case 'loading':
            return '⏳';
        default:
            return '💬'; // Defaultní ikona pro neznámé typy
    }
};

export const getLogColor = (type: LogType): string => {
    switch (type) {
        case 'info':
            return 'text-blue-500';
        case 'success':
            return 'text-green-500';
        case 'warning':
            return 'text-yellow-500';
        case 'error':
            return 'text-red-500';
        case 'debug':
            return 'text-gray-500'; // Šedá pro debug, aby nebyla příliš výrazná
        case 'api':
            return 'text-purple-500';
        case 'system':
            return 'text-gray-700';
        case 'loading':
            return 'text-blue-400';
        default:
            return 'text-black'; // Defaultní barva
    }
};
