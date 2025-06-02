/**
 * DynamicDataLogger.ts - Pokročilý logging systém pro mapovou aplikaci
 * Poskytuje structured logging s emoji, barvami a historií pro debug účely
 */

/**
 * Singleton logger pro sledování API operací a mapových událostí
 */

export class DynamicDataLogger {
    private static instance: DynamicDataLogger;
    private logHistory: string[] = [];

    static getInstance(): DynamicDataLogger {
        if (!this.instance) {
            this.instance = new DynamicDataLogger();
        }
        return this.instance;
    }

    private log(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const formattedMessage = `[${timestamp}] ${message}`;

        this.logHistory.push(formattedMessage);

        // Zachovat pouze posledních 50 zpráv
        if (this.logHistory.length > 50) {
            this.logHistory = this.logHistory.slice(-50);
        }

        // Logovat do konzole s různými styly
        switch (type) {
            case 'success':
                console.log(`%c${formattedMessage}`, 'color: #16a34a; font-weight: bold;');
                break;
            case 'warning':
                console.log(`%c${formattedMessage}`, 'color: #ca8a04; font-weight: bold;');
                break;
            case 'error':
                console.log(`%c${formattedMessage}`, 'color: #dc2626; font-weight: bold;');
                break;
            default:
                console.log(`%c${formattedMessage}`, 'color: #3b82f6;');
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logApiRequest(region: string, bounds: any, zoom: number) {
        this.log(`🚀 API Request: ${region} | Zoom: ${zoom} | Bounds: [${bounds.south.toFixed(2)}, ${bounds.west.toFixed(2)}] → [${bounds.north.toFixed(2)}, ${bounds.east.toFixed(2)}]`, 'info');
    }

    logApiResponse(count: number, total: number, loadTime: number, region: string) {
        this.log(`✅ API Response: ${count} spaloven z ${total} v oblasti | ${loadTime}ms | Region: ${region}`, 'success');
    }

    logRegionDetection(region: string | null, isKnown: boolean) {
        if (isKnown) {
            this.log(`🌍 Region detekován: ${region}`, 'success');
        } else {
            this.log(`❓ Neznámý region: ${region || 'Oblast mimo hlavní regiony'}`, 'warning');
        }
    }

    logDataFiltering(originalCount: number, filteredCount: number, maxAllowed: number) {
        if (filteredCount < originalCount) {
            this.log(`🔄 Data filtrována: ${originalCount} → ${filteredCount} (limit: ${maxAllowed})`, 'warning');
        } else {
            this.log(`✨ Všechna data zobrazena: ${filteredCount} spaloven`, 'info');
        }
    }

    logClustering(enabled: boolean, zoom: number) {
        if (enabled) {
            this.log(`🔗 Clustering aktivní pro zoom ${zoom}`, 'info');
        } else {
            this.log(`🔍 Detailní zobrazení pro zoom ${zoom}`, 'info');
        }
    }

    logSlowRequest(actualTime: number, expectedTime: number) {
        this.log(`🐌 Pomalý request: ${actualTime}ms (očekáváno: ${expectedTime}ms)`, 'warning');
    } logError(error: string) {
        this.log(`❌ Chyba: ${error}`, 'error');
    }

    logConnectionTest(message: string, success?: boolean) {
        if (success === true) {
            this.log(`✅ ${message}`, 'success');
        } else if (success === false) {
            this.log(`❌ ${message}`, 'error');
        } else {
            this.log(`🔗 ${message}`, 'info');
        }
    }

    logViewportChange(changeNumber: number) {
        this.log(`📍 Viewport změna #${changeNumber}`, 'info');
    }

    getLogHistory(): string[] {
        return [...this.logHistory];
    }

    clearLogs() {
        this.logHistory = [];
        this.log('🗑️ Logy vymazány', 'info');
    }
}

export const dynamicLogger = DynamicDataLogger.getInstance();
