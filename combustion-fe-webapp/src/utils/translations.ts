// This file provides a simple translation function.
// It currently defaults to Czech (cs) translations.
import cs from '@/i18n/locales/cs.json'; // Imports Czech translation data.

// Defines the translation function `t`.
// It takes a key (e.g., "navigation.home") and returns the corresponding translated string.
export function t(key: string): string {
    // Splits the key into parts for nested object traversal (e.g., "navigation.home" becomes ["navigation", "home"]).
    const parts = key.split('.')

    // Initializes the result with the entire Czech translation object.
    let result: unknown = cs;
    // Iterates through the parts of the key to find the nested translation value.
    for (const part of parts) {
        if (typeof result !== "object" || result === null || !(part in result)) {
            return key; // Returns the original key if translation is not found.
        }
        result = (result as Record<string, unknown>)[part];
    }

    // Returns the found translated string.
    return result as string;
}