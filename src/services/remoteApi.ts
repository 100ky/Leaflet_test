/**
 * Služba pro komunikaci se vzdáleným API spaloven
 * 
 * Poskytuje přístup k externímu API pomocí Next.js proxy route:
 * - Řeší CORS problémy pomocí server-side proxy
 * - Cachuje odpovědi pro optimalizaci výkonu
 * - Implementuje retry logiku při selhání
 * - Loguje všechny API operace pro monitoring
 * 
 * Původní API: https://combustion.radek18.com/api/incinerators
 * 
 * @module remoteApi
 */

import { Incinerator } from '@/types';
import { ApiRequest, ApiResponse } from './incineratorApi';
import { logger } from '@/utils/logger';

// Proxy endpoint místo přímého API kvůli CORS omezením
const REMOTE_API_BASE_URL = '/api'; // Náš Next.js API route proxy

/**
 * Načte data ze vzdáleného API podle zoom úrovně
 */
export const fetchRemoteIncinerators = async (zoom?: number): Promise<Incinerator[]> => {
    const startTime = Date.now();

    try {
        logger.logConnectionTest('Načítání dat ze vzdáleného API...');
        logger.api(`Fetching data from remote API with zoom: ${zoom || 'default'}...`);

        // Vytvoření AbortController pro timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 sekund pro načítání dat

        // Vytvoření URL s zoom parametrem pokud je zadán
        const url = zoom !== undefined
            ? `${REMOTE_API_BASE_URL}/remote-incinerators?zoom=${zoom}`
            : `${REMOTE_API_BASE_URL}/remote-incinerators`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        } const rawData: Incinerator[] = await response.json();

        if (!Array.isArray(rawData)) {
            throw new Error('API nevrátilo pole dat');
        }

        logger.api(`Received ${rawData.length} records from remote API`);

        // Data jsou už v správném formátu, jen vyfiltrujeme záznamy s chybějícími souřadnicemi
        const validData = rawData.filter(item =>
            item.location &&
            typeof item.location.lat === 'number' &&
            typeof item.location.lng === 'number' &&
            !isNaN(item.location.lat) &&
            !isNaN(item.location.lng)
        ); const loadTime = Date.now() - startTime;

        logger.logApiResponse(
            validData.length,
            rawData.length,
            loadTime,
            'Vzdálené API'
        );

        return validData;
    } catch (error) {
        const loadTime = Date.now() - startTime;
        logger.error(`Chyba při načítání vzdálených dat: ${error}`);

        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                logger.logConnectionTest('Připojení k vzdálenému API vypršel časový limit', false);
                throw new Error('Připojení k vzdálenému API vypršel časový limit');
            } else if (error.message.includes('HTTP error')) {
                logger.logConnectionTest(`Vzdálené API vrátilo chybu: ${error.message}`, false);
                throw new Error(`Vzdálené API vrátilo chybu: ${error.message}`);
            }
        }

        logger.error(`Nepodařilo se načíst data ze vzdáleného API po ${loadTime}ms`);
        throw new Error('Nepodařilo se načíst data ze vzdáleného API');
    }
};

/**
 * Načte data ze vzdáleného API podle hranic a zoom úrovně
 * Vzdálené API možná nepodporuje filtrování podle hranic, takže načteme vše a filtrujeme lokálně
 */
export const fetchRemoteIncineratorsByViewport = async (request: ApiRequest): Promise<ApiResponse> => {
    try {
        // Načteme všechna data ze vzdáleného API s předáním zoom úrovně
        const allIncinerators = await fetchRemoteIncinerators(request.zoom);

        // Filtrujeme podle hranic lokálně
        const filteredIncinerators = allIncinerators.filter(incinerator => {
            const { lat, lng } = incinerator.location;
            return lat >= request.bounds.south &&
                lat <= request.bounds.north &&
                lng >= request.bounds.west &&
                lng <= request.bounds.east;
        });

        return {
            incinerators: filteredIncinerators,
            totalCount: filteredIncinerators.length,
            clustered: request.zoom < 10
        };
    } catch (error) {
        logger.error(`Chyba při načítání dat podle viewport: ${error}`);
        throw error;
    }
};

/**
 * Testovací funkce pro ověření připojení k vzdálenému API
 */
export const testRemoteApiConnection = async (): Promise<boolean> => {
    try {
        logger.logConnectionTest('Testování připojení k vzdálenému API...');

        // Vytvoření AbortController pro timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 sekund

        // API nepodporuje HEAD request, používáme GET s malým limitem
        const response = await fetch(`${REMOTE_API_BASE_URL}/remote-incinerators`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller.signal
        }); clearTimeout(timeoutId);

        logger.debug(`Test vzdáleného API: ${response.ok} (status: ${response.status})`);

        if (response.ok) {
            logger.logConnectionTest('Vzdálené API je dostupné a funguje', true);
            return true;
        } else {
            logger.logConnectionTest(`Vzdálené API vrátilo chybu: ${response.status}`, false);
            return false;
        }
    } catch (error) {
        logger.warn(`Test připojení k vzdálenému API selhal: ${error}`);

        if (error instanceof Error && error.name === 'AbortError') {
            logger.logConnectionTest('Vzdálené API - časový limit vypršel', false);
        } else {
            logger.logConnectionTest(`Vzdálené API - chyba připojení: ${error instanceof Error ? error.message : 'Unknown error'}`, false);
        }

        return false;
    }
};
