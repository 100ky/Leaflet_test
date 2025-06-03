/**
 * Shared utility functions for status indicators, icons, and common UI patterns
 * Consolidates repeated code across components
 */

/**
 * API Status utilities
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
 * Debug log utilities
 */
export type LogType = 'api' | 'viewport' | 'cache' | 'error' | 'loading';

export const getLogColor = (type: LogType): string => {
    switch (type) {
        case 'api': return 'text-blue-600';
        case 'viewport': return 'text-green-600';
        case 'cache': return 'text-purple-600';
        case 'error': return 'text-red-600';
        default: return 'text-gray-600';
    }
};

export const getLogIcon = (type: LogType): string => {
    switch (type) {
        case 'api': return '🌐';
        case 'viewport': return '🗺️';
        case 'cache': return '💾';
        case 'error': return '❌';
        default: return 'ℹ️';
    }
};
