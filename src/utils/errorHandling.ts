/**
 * errorHandling.ts - Centralizované zpracování chyb pro aplikaci
 * Poskytuje konzistentní způsob zpracování různých typů chyb
 */

import { logger } from './logger';

/**
 * Typy chyb v aplikaci
 */
export enum ErrorType {
    SIMULATED_API_ERROR = 'simulated_api_error',
    NETWORK_ERROR = 'network_error',
    VALIDATION_ERROR = 'validation_error',
    UNKNOWN_ERROR = 'unknown_error'
}

/**
 * Interface pro standardizovanou chybu
 */
export interface AppError {
    type: ErrorType;
    message: string;
    originalError?: Error;
    retryable: boolean;
    userFriendlyMessage: string;
}

/**
 * Klasifikuje chybu podle jejího typu
 */
export const classifyError = (error: Error | string): AppError => {
    const errorMessage = typeof error === 'string' ? error : error.message;

    if (errorMessage.includes('Simulovaná chyba API')) {
        return {
            type: ErrorType.SIMULATED_API_ERROR,
            message: errorMessage,
            originalError: typeof error === 'object' ? error : undefined,
            retryable: true,
            userFriendlyMessage: 'Server je dočasně nedostupný, zkouším znovu...'
        };
    }

    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        return {
            type: ErrorType.NETWORK_ERROR,
            message: errorMessage,
            originalError: typeof error === 'object' ? error : undefined,
            retryable: true,
            userFriendlyMessage: 'Problém se sítí, zkontrolujte připojení'
        };
    }

    if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
        return {
            type: ErrorType.VALIDATION_ERROR,
            message: errorMessage,
            originalError: typeof error === 'object' ? error : undefined,
            retryable: false,
            userFriendlyMessage: 'Neplatná data, obnovte stránku'
        };
    }

    return {
        type: ErrorType.UNKNOWN_ERROR,
        message: errorMessage,
        originalError: typeof error === 'object' ? error : undefined,
        retryable: false,
        userFriendlyMessage: 'Nastala neočekávaná chyba'
    };
};

/**
 * Handler pro retry logiku
 */
export const createRetryHandler = (
    operation: () => Promise<void>,
    maxRetries: number = 3,
    delay: number = 1000
) => {
    let retryCount = 0;

    const retry = async (): Promise<void> => {
        try {
            await operation();
            retryCount = 0; // Reset počítadla při úspěchu
        } catch (error) {
            const appError = classifyError(error as Error);

            if (appError.retryable && retryCount < maxRetries) {
                retryCount++;
                logger.warn(`Retry attempt ${retryCount}/${maxRetries} for error: ${appError.message}`);

                setTimeout(() => {
                    retry();
                }, delay * retryCount); // Exponentiální backoff
            } else {
                logger.error(`Max retries exceeded or error not retryable: ${appError.message}`);
                throw error;
            }
        }
    };

    return retry;
};

/**
 * Utility pro logování chyb s kontextem
 */
export const logErrorWithContext = (error: Error | string, context: string, additionalData?: Record<string, unknown>) => {
    const appError = classifyError(error as Error);

    logger.error(`[${context}] ${appError.type}: ${appError.message}`, {
        type: appError.type,
        retryable: appError.retryable,
        context,
        additionalData
    });
};
