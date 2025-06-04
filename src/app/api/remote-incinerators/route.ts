/**
 * API proxy pro vzdálené API - řešení CORS problémů
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/utils/logger';

const REMOTE_API_BASE_URL = 'https://combustion.radek18.com/api';

export async function GET(request: NextRequest) {
    try {
        logger.api('Proxy: Forwarding request to remote API...');

        // Získání zoom parametru z URL query
        const { searchParams } = new URL(request.url);
        const zoomParam = searchParams.get('zoom');
        const zoom = zoomParam ? parseFloat(zoomParam) : 0;

        logger.api(`Proxy: Request with zoom level ${zoom}`);

        // Vytvoření AbortController pro timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 sekund

        const response = await fetch(`${REMOTE_API_BASE_URL}/incinerators`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Leaflet-Map-App/1.0',
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            logger.error(`Remote API error: ${response.status} ${response.statusText}`);
            return NextResponse.json(
                { error: `Remote API returned ${response.status}: ${response.statusText}` },
                { status: response.status }
            );
        }

        let data = await response.json();        // Filtrování polygon dat podle zoom úrovně
        if (zoom < 12) {
            logger.api(`Proxy: Filtering out polygon data for zoom ${zoom} (< 12)`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data = data.map((incinerator: any) => {
                const hasPolygons = incinerator.propertyBoundary || (incinerator.buildings && incinerator.buildings.length > 0);
                if (hasPolygons) {
                    logger.debug(`   Optimizing ${incinerator.name || `ID:${incinerator.id}`}: removing ${incinerator.propertyBoundary ? 'property boundary' : ''}${incinerator.propertyBoundary && incinerator.buildings?.length ? ' + ' : ''}${incinerator.buildings?.length ? `${incinerator.buildings.length} buildings` : ''}`);
                }
                return {
                    ...incinerator,
                    propertyBoundary: null, // Odstraníme polygon areálu
                    buildings: [] // Odstraníme budovy
                };
            });
        } else {
            logger.api(`Proxy: Including polygon data for zoom ${zoom} (>= 12)`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data.forEach((incinerator: any) => {
                const hasPolygons = incinerator.propertyBoundary || (incinerator.buildings && incinerator.buildings.length > 0);
                if (hasPolygons) {
                    logger.debug(`   Including ${incinerator.name || `ID:${incinerator.id}`}: ${incinerator.propertyBoundary ? 'property boundary' : ''}${incinerator.propertyBoundary && incinerator.buildings?.length ? ' + ' : ''}${incinerator.buildings?.length ? `${incinerator.buildings.length} buildings` : ''}`);
                } else {
                    logger.debug(`   ${incinerator.name || `ID:${incinerator.id}`}: no polygon data available`);
                }
            });
        }

        logger.api(`Proxy: Successfully fetched ${data.length} records from remote API`);

        // Vrátíme data s CORS hlavičkami
        return NextResponse.json(data, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });

    } catch (error) {
        logger.error('Proxy error:', error);

        if (error instanceof Error && error.name === 'AbortError') {
            return NextResponse.json(
                { error: 'Request timeout - remote API did not respond in time' },
                { status: 408 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to connect to remote API' },
            { status: 502 }
        );
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
