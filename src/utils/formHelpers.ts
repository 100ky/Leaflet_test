/**
 * Pomocné funkce pro formuláře a validaci
 * Konsoliduje společnou logiku pro práci s formuláři napříč aplikací
 */

import { MapBounds } from '@/services/incineratorApi';

/**
 * Validuje bounds pro mapu
 */
export const validateBounds = (bounds: Partial<MapBounds>): boolean => {
    const { north, south, east, west } = bounds;

    if (typeof north !== 'number' || typeof south !== 'number' ||
        typeof east !== 'number' || typeof west !== 'number') {
        return false;
    }

    return north > south && east > west;
};

/**
 * Validuje zoom hodnotu
 */
export const validateZoom = (zoom: number): boolean => {
    return zoom >= 1 && zoom <= 18;
};

/**
 * Formátuje číslo s desetinnými místy
 */
export const formatNumber = (value: number, decimals: number = 4): string => {
    return value.toFixed(decimals);
};

/**
 * Parsuje a validuje číselný vstup
 */
export const parseNumericInput = (value: string, min?: number, max?: number): number | null => {
    const parsed = parseFloat(value);

    if (isNaN(parsed)) {
        return null;
    }

    if (min !== undefined && parsed < min) {
        return null;
    }

    if (max !== undefined && parsed > max) {
        return null;
    }

    return parsed;
};

/**
 * Vytvoří handler pro změnu bounds
 */
export const createBoundsChangeHandler = (
    setBounds: (bounds: MapBounds) => void,
    currentBounds: MapBounds
) => {
    return {
        north: (value: string) => {
            const parsed = parseFloat(value);
            if (!isNaN(parsed)) {
                setBounds({ ...currentBounds, north: parsed });
            }
        },
        south: (value: string) => {
            const parsed = parseFloat(value);
            if (!isNaN(parsed)) {
                setBounds({ ...currentBounds, south: parsed });
            }
        },
        east: (value: string) => {
            const parsed = parseFloat(value);
            if (!isNaN(parsed)) {
                setBounds({ ...currentBounds, east: parsed });
            }
        },
        west: (value: string) => {
            const parsed = parseFloat(value);
            if (!isNaN(parsed)) {
                setBounds({ ...currentBounds, west: parsed });
            }
        }
    };
};

/**
 * Vytvoří props pro input pole s bounds
 */
export const createBoundsInputProps = (
    bounds: MapBounds,
    handlers: ReturnType<typeof createBoundsChangeHandler>
) => ({
    north: {
        type: 'number' as const,
        step: '0.1',
        value: bounds.north,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => handlers.north(e.target.value),
        className: 'input-base'
    },
    south: {
        type: 'number' as const,
        step: '0.1',
        value: bounds.south,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => handlers.south(e.target.value),
        className: 'input-base'
    },
    east: {
        type: 'number' as const,
        step: '0.1',
        value: bounds.east,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => handlers.east(e.target.value),
        className: 'input-base'
    },
    west: {
        type: 'number' as const,
        step: '0.1',
        value: bounds.west,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => handlers.west(e.target.value),
        className: 'input-base'
    }
});

/**
 * Vytvoří props pro zoom input
 */
export const createZoomInputProps = (
    zoom: number,
    onChange: (zoom: number) => void
) => ({
    type: 'number' as const,
    min: '1',
    max: '18',
    value: zoom,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const parsed = parseInt(e.target.value);
        if (!isNaN(parsed)) {
            onChange(parsed);
        }
    },
    className: 'input-base'
});

/**
 * Debounce funkce pro omezení frekvence volání
 */
export const debounce = <T extends (...args: unknown[]) => void>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

/**
 * Throttle funkce pro omezení frekvence volání
 */
export const throttle = <T extends (...args: unknown[]) => void>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Konstanty pro formuláře
 */
export const FORM_CONSTANTS = {
    BOUNDS_STEP: '0.1',
    ZOOM_MIN: 1,
    ZOOM_MAX: 18,
    DEBOUNCE_DELAY: 300,
    THROTTLE_DELAY: 100
} as const;

/**
 * Přednastavené bounds pro testování
 */
export const PRESET_BOUNDS = {
    prague: {
        name: 'Praha',
        bounds: { north: 50.2, south: 49.9, east: 14.8, west: 14.2 },
        zoom: 11
    },
    brno: {
        name: 'Brno',
        bounds: { north: 49.3, south: 49.1, east: 16.8, west: 16.4 },
        zoom: 11
    },
    czechRepublic: {
        name: 'Celá ČR',
        bounds: { north: 51.1, south: 48.5, east: 18.9, west: 12.0 },
        zoom: 7
    }
} as const;
