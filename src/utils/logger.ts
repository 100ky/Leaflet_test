/**
 * Unified production-ready logging utility
 * Combines standard logging with structured logging capabilities and history tracking
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogType = 'info' | 'success' | 'warning' | 'error';

interface LoggerConfig {
    isDevelopment: boolean;
    minLevel: LogLevel;
    maxHistorySize: number;
}

class Logger {
    private config: LoggerConfig;
    private logHistory: string[] = [];
    private logLevels: Record<LogLevel, number> = {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3
    };

    constructor() {
        this.config = {
            isDevelopment: process.env.NODE_ENV !== 'production',
            minLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
            maxHistorySize: 50
        };
    }

    private shouldLog(level: LogLevel): boolean {
        return this.logLevels[level] >= this.logLevels[this.config.minLevel];
    }

    private addToHistory(message: string): void {
        const timestamp = new Date().toLocaleTimeString();
        const formattedMessage = `[${timestamp}] ${message}`;

        this.logHistory.push(formattedMessage);

        // Keep only recent logs
        if (this.logHistory.length > this.config.maxHistorySize) {
            this.logHistory = this.logHistory.slice(-this.config.maxHistorySize);
        }
    }

    private logWithStyle(message: string, type: LogType, level: LogLevel): void {
        if (!this.shouldLog(level)) return;

        this.addToHistory(message);

        // Console styling for different types
        switch (type) {
            case 'success':
                console.log(`%c${message}`, 'color: #16a34a; font-weight: bold;');
                break;
            case 'warning':
                console.log(`%c${message}`, 'color: #ca8a04; font-weight: bold;');
                break;
            case 'error':
                console.log(`%c${message}`, 'color: #dc2626; font-weight: bold;');
                break;
            default:
                console.log(`%c${message}`, 'color: #3b82f6;');
        }
    }

    // Standard logging methods
    debug(message: string, ...args: unknown[]): void {
        if (this.shouldLog('debug')) {
            const fullMessage = `🔍 ${message}`;
            this.addToHistory(fullMessage);
            console.log(fullMessage, ...args);
        }
    }

    info(message: string, ...args: unknown[]): void {
        if (this.shouldLog('info')) {
            const fullMessage = `ℹ️  ${message}`;
            this.addToHistory(fullMessage);
            console.log(fullMessage, ...args);
        }
    }

    warn(message: string, ...args: unknown[]): void {
        if (this.shouldLog('warn')) {
            const fullMessage = `⚠️  ${message}`;
            this.addToHistory(fullMessage);
            console.warn(fullMessage, ...args);
        }
    }

    error(message: string, ...args: unknown[]): void {
        if (this.shouldLog('error')) {
            const fullMessage = `❌ ${message}`;
            this.addToHistory(fullMessage);
            console.error(fullMessage, ...args);
        }
    }

    // Context-specific methods
    api(message: string, ...args: unknown[]): void {
        if (this.shouldLog('debug')) {
            const fullMessage = `🌐 API: ${message}`;
            this.addToHistory(fullMessage);
            console.log(fullMessage, ...args);
        }
    }

    map(message: string, ...args: unknown[]): void {
        if (this.shouldLog('debug')) {
            const fullMessage = `🗺️  Map: ${message}`;
            this.addToHistory(fullMessage);
            console.log(fullMessage, ...args);
        }
    }

    cache(message: string, ...args: unknown[]): void {
        if (this.shouldLog('debug')) {
            const fullMessage = `💾 Cache: ${message}`;
            this.addToHistory(fullMessage);
            console.log(fullMessage, ...args);
        }
    }

    // Structured logging methods (replacing DynamicDataLogger functionality)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logApiRequest(region: string, bounds: any, zoom: number): void {
        const message = `🚀 API Request: ${region} | Zoom: ${zoom} | Bounds: [${bounds.south.toFixed(2)}, ${bounds.west.toFixed(2)}] → [${bounds.north.toFixed(2)}, ${bounds.east.toFixed(2)}]`;
        this.logWithStyle(message, 'info', 'debug');
    }

    logApiResponse(count: number, total: number, loadTime: number, region: string): void {
        const message = `✅ API Response: ${count} spaloven z ${total} v oblasti | ${loadTime}ms | Region: ${region}`;
        this.logWithStyle(message, 'success', 'debug');
    }

    logRegionDetection(region: string | null, isKnown: boolean): void {
        if (isKnown) {
            const message = `🌍 Region detekován: ${region}`;
            this.logWithStyle(message, 'success', 'debug');
        } else {
            const message = `❓ Neznámý region: ${region || 'Oblast mimo hlavní regiony'}`;
            this.logWithStyle(message, 'warning', 'debug');
        }
    }

    logDataFiltering(originalCount: number, filteredCount: number, maxAllowed: number): void {
        if (filteredCount < originalCount) {
            const message = `🔄 Data filtrována: ${originalCount} → ${filteredCount} (limit: ${maxAllowed})`;
            this.logWithStyle(message, 'warning', 'debug');
        } else {
            const message = `✨ Všechna data zobrazena: ${filteredCount} spaloven`;
            this.logWithStyle(message, 'info', 'debug');
        }
    }

    logClustering(enabled: boolean, zoom: number): void {
        if (enabled) {
            const message = `🔗 Clustering aktivní pro zoom ${zoom}`;
            this.logWithStyle(message, 'info', 'debug');
        } else {
            const message = `🔍 Detailní zobrazení pro zoom ${zoom}`;
            this.logWithStyle(message, 'info', 'debug');
        }
    }

    logSlowRequest(actualTime: number, expectedTime: number): void {
        const message = `🐌 Pomalý request: ${actualTime}ms (očekáváno: ${expectedTime}ms)`;
        this.logWithStyle(message, 'warning', 'warn');
    }

    logConnectionTest(message: string, success?: boolean): void {
        if (success === true) {
            const fullMessage = `✅ ${message}`;
            this.logWithStyle(fullMessage, 'success', 'debug');
        } else if (success === false) {
            const fullMessage = `❌ ${message}`;
            this.logWithStyle(fullMessage, 'error', 'error');
        } else {
            const fullMessage = `🔗 ${message}`;
            this.logWithStyle(fullMessage, 'info', 'debug');
        }
    }

    logViewportChange(changeNumber: number): void {
        const message = `📍 Viewport změna #${changeNumber}`;
        this.logWithStyle(message, 'info', 'debug');
    }

    // History management
    getLogHistory(): string[] {
        return [...this.logHistory];
    }

    clearLogs(): void {
        this.logHistory = [];
        this.info('🗑️ Logy vymazány');
    }
}

export const logger = new Logger();
