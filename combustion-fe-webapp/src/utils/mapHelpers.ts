// src/utils/mapHelpers.ts

import { Incinerator } from "@/types/incinerator";

/**
 * Map constants
 */
export const MAP_CONSTANTS = {
  MAP_STYLE: {
    height: '100%',
    width: '100%',
  },
  DEFAULT_CENTER: [49.75, 15.5] as [number, number],
  DEFAULT_ZOOM: 7,
  MIN_ZOOM: 6,
  MAX_ZOOM: 18,
};

/**
 * Determines if an incinerator is planned for a future year.
 */
export const isPlannedIncinerator = (incinerator: Incinerator): boolean => {
  if (!incinerator.yearEstablished) {
    return false;
  }
  const currentYear = new Date().getFullYear();
  return incinerator.yearEstablished > currentYear;
};

/**
 * Creates the HTML content for an incinerator's popup.
 * @param incinerator The incinerator data object.
 * @returns An HTML string for the popup.
 */
export const createIncineratorPopupContent = (
    incinerator: Incinerator,
): string => {
    const isPlanned = isPlannedIncinerator(incinerator);

    const title = incinerator.name || 'Spalovna bez názvu';
    const status = incinerator.operational ? 'V provozu' : (isPlanned ? 'Plánovaná' : 'Mimo provoz');
    const capacity = incinerator.capacity ? `${incinerator.capacity.toLocaleString('cs-CZ')} t/rok` : null;
    const description = incinerator.description || null;

    let html = `
    <div style="line-height: 1.6;">
      <h3 style="font-weight: bold; margin: 0 0 8px 0; font-size: 16px;">${title}</h3>
      <p style="margin: 0;"><strong>Status:</strong> ${status}</p>
    `;

    if (capacity) {
        html += `<p style="margin: 0;"><strong>Kapacita:</strong> ${capacity}</p>`;
    }

    if (description) {
        html += `<p style="margin: 8px 0 0 0; font-size: 13px;">${description}</p>`;
    }

    html += '</div>';
    return html;
};
