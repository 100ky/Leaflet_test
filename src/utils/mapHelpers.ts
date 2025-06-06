/**
 * Pomocné funkce pro Map komponentu
 * Konsoliduje duplicitní logiku pro práci s mapou a markery
 */

import { Incinerator, IncineratorOfficialInfo, BuildingType } from '@/types';
import L from 'leaflet';

/**
 * Vypočítá střed mapy na základě všech spaloven
 */
export const calculateMapCenter = (incinerators: Incinerator[]): [number, number] => {
    if (!incinerators || incinerators.length === 0) {
        // Výchozí střed ČR, pokud nejsou žádné spalovny
        return [49.8, 15.5];
    }

    // Výpočet průměrné polohy všech spaloven
    const sumLat = incinerators.reduce((sum, inc) => sum + inc.location.lat, 0);
    const sumLng = incinerators.reduce((sum, inc) => sum + inc.location.lng, 0);

    return [sumLat / incinerators.length, sumLng / incinerators.length];
};

/**
 * Určí, zda je spalovna plánovaná
 */
export const isPlannedIncinerator = (incinerator: Incinerator): boolean => {
    const currentYear = new Date().getFullYear();
    return !incinerator.operational &&
        incinerator.yearEstablished !== undefined &&
        incinerator.yearEstablished > currentYear;
};

/**
 * Vrací styl polygonu podle typu budovy spalovny
 */
export const getBuildingStyle = (buildingType: BuildingType) => {
    const baseStyle = { weight: 2, opacity: 0.8, fillOpacity: 0.3 };

    switch (buildingType) {
        case BuildingType.MainBuilding:
            return { ...baseStyle, color: '#ff0000', fillColor: '#ff5555' };
        case BuildingType.ChimneyStack:
            return { ...baseStyle, color: '#555555', fillColor: '#999999', fillOpacity: 0.6 };
        case BuildingType.ProcessingUnit:
            return { ...baseStyle, color: '#0000ff', fillColor: '#5555ff' };
        case BuildingType.StorageArea:
            return { ...baseStyle, color: '#00ff00', fillColor: '#55ff55' };
        case BuildingType.WasteBunker:
            return { ...baseStyle, color: '#ff9900', fillColor: '#ffcc77' };
        case BuildingType.AshStorage:
            return { ...baseStyle, color: '#996633', fillColor: '#cc9966' };
        default:
            return { ...baseStyle, color: '#333333', fillColor: '#777777' };
    }
};

/**
 * Styl pro celý areál spalovny
 */
export const getPropertyStyle = () => ({
    color: '#cc0000',
    fillColor: '#ff5555',
    weight: 3,
    opacity: 1,
    fillOpacity: 0.3
});

/**
 * Typ pro obsah popup okna
 */
type PopupContent = {
    title: string;
    description: string | undefined;
    capacity: string;
    status: string;
    yearEstablished: string | number;
    showDetails: boolean | IncineratorOfficialInfo | undefined;
    officialInfo: IncineratorOfficialInfo | undefined;
    currentZoom: number;
    detailThreshold: number;
};

/**
 * Vytvoří popup obsah pro spalovnu podle úrovně detailu
 */
export const createIncineratorPopupContent = (
    incinerator: Incinerator,
    currentZoom: number,
    usingRemoteApi: boolean,
    detailThreshold: number = 12
): string => {
    const isPlanned = isPlannedIncinerator(incinerator);

    const content = {
        title: incinerator.name,
        description: incinerator.description,
        capacity: `${incinerator.capacity} tun/rok`,
        status: incinerator.operational
            ? 'V provozu'
            : (isPlanned ? 'Plánovaná výstavba' : 'Mimo provoz'),
        yearEstablished: incinerator.yearEstablished || 'Neznámo',
        showDetails: currentZoom >= detailThreshold && !usingRemoteApi && incinerator.officialInfo,
        officialInfo: incinerator.officialInfo,
        currentZoom,
        detailThreshold
    };

    return generatePopupHTML(content);
};

/**
 * Generuje HTML obsah pro popup spalovny
 */
export const generatePopupHTML = (content: PopupContent): string => {
    let html = `
    <div style="max-height: 400px; overflow-y: auto;">
      <h3 style="margin: 0 0 10px 0; font-size: 16px;">${content.title}</h3>
      <p style="margin: 5px 0; font-size: 14px;">${content.description}</p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Kapacita:</strong> ${content.capacity}</p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Stav:</strong> ${content.status}</p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Založeno:</strong> ${content.yearEstablished}</p>
  `;

    if (content.showDetails && content.officialInfo) {
        html += `
      <div style="margin-top: 10px; border-top: 1px solid #eee; padding-top: 10px;">
        <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #333;">Oficiální informace:</h4>
        <div style="font-size: 11px; color: #666; margin-bottom: 8px;">
          <em>Aktuální zoom: ${content.currentZoom.toFixed(1)} (detail od ${content.detailThreshold})</em>
        </div>
        <div style="font-size: 13px; line-height: 1.4;">
          <p style="margin: 4px 0;"><strong>Provozovatel:</strong> ${content.officialInfo.operator}</p>
          <p style="margin: 4px 0;"><strong>Vlastník:</strong> ${content.officialInfo.owner}</p>
          <p style="margin: 4px 0;"><strong>Web:</strong> <a href="${content.officialInfo.website}" target="_blank" rel="noopener noreferrer" style="word-break: break-all;">Odkaz</a></p>
          <p style="margin: 4px 0;"><strong>Telefon:</strong> ${content.officialInfo.phone}</p>
          <p style="margin: 4px 0;"><strong>Email:</strong> <span style="word-break: break-all;">${content.officialInfo.email}</span></p>
          <p style="margin: 4px 0;"><strong>Technologie:</strong> ${content.officialInfo.technology}</p>
          <p style="margin: 4px 0;"><strong>Počet linek:</strong> ${content.officialInfo.numberOfLines}</p>
          <p style="margin: 4px 0;"><strong>Max. kapacita/linku:</strong> ${content.officialInfo.maxCapacityPerLine} t/rok</p>
          <p style="margin: 4px 0;"><strong>Elektrický výkon:</strong> ${content.officialInfo.electricalPowerMW} MW</p>
          <p style="margin: 4px 0;"><strong>Tepelný výkon:</strong> ${content.officialInfo.thermalPowerMW} MW</p>
          <p style="margin: 4px 0;"><strong>Produkce páry:</strong> ${content.officialInfo.steamProductionTh} t/h</p>
    `;

        if (content.officialInfo.emissionLimits) {
            html += `
        <div style="margin: 8px 0;">
          <p style="margin: 4px 0;"><strong>Emisní limity (mg/m³):</strong></p>
          <ul style="margin: 4px 0 4px 20px; padding: 0; font-size: 12px;">
            <li>CO: ${content.officialInfo.emissionLimits.CO}</li>
            <li>NOx: ${content.officialInfo.emissionLimits.NOx}</li>
            <li>SO2: ${content.officialInfo.emissionLimits.SO2}</li>
            <li>Prach: ${content.officialInfo.emissionLimits.dust}</li>
            <li>Dioxiny (ng/m³): ${content.officialInfo.emissionLimits.dioxins}</li>
          </ul>
        </div>
      `;
        }

        if (content.officialInfo.certifications?.length) {
            html += `<p style="margin: 4px 0;"><strong>Certifikace:</strong> ${content.officialInfo.certifications.join(', ')}</p>`;
        }

        if (content.officialInfo.wasteTypes?.length) {
            html += `<p style="margin: 4px 0;"><strong>Typy odpadu:</strong> ${content.officialInfo.wasteTypes.join(', ')}</p>`;
        }

        html += `
          <p style="margin: 4px 0;"><strong>Provozní doba:</strong> ${content.officialInfo.operatingHours}</p>
          <p style="margin: 4px 0;"><strong>Plán údržby:</strong> ${content.officialInfo.maintenanceSchedule}</p>
        </div>
      </div>
    `;
    } else {
        html += `
      <div style="font-size: 13px;">
        <p style="margin: 4px 0;"><strong>Provozovatel:</strong> ${content.officialInfo?.operator || 'Neznámý'}</p>
        <p style="margin: 4px 0;"><strong>Web:</strong> <a href="${content.officialInfo?.website || '#'}" target="_blank" rel="noopener noreferrer">Odkaz</a></p>
        <p style="margin: 8px 0; font-style: italic; color: #666; font-size: 12px;">
          (Přibližte na zoom ≥ ${content.detailThreshold} pro více detailů)
        </p>
      </div>
    `;
    }

    html += '</div>';
    return html;
};

/**
 * Vytvoří MapBounds objekt z Leaflet bounds
 */
export const createMapBounds = (bounds: L.LatLngBounds) => ({
    north: bounds.getNorth(),
    south: bounds.getSouth(),
    east: bounds.getEast(),
    west: bounds.getWest()
});

/**
 * Mapové konstanty
 */
export const MAP_CONSTANTS = {
    DEFAULT_ZOOM: 7.5,
    DETAIL_ZOOM_THRESHOLD: 12,
    DEFAULT_CENTER_CR: [49.8, 15.5] as [number, number],
    MAP_STYLE: {
        height: '600px',
        width: '100%',
    }
} as const;

/**
 * CSS třídy pro mapové prvky
 */
export const MAP_CLASSES = {
    mapContainer: 'map-container relative',
    controlPanel: 'absolute top-3 right-3 bg-white bg-opacity-95 rounded-lg p-3 shadow-lg z-[1000]',
    loadingIndicator: 'absolute top-3 right-20 bg-blue-100 border border-blue-400 text-blue-700 px-3 py-2 rounded z-[1000]',
    errorIndicator: 'absolute top-3 right-20 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded z-[1000]',
    infoPanel: 'absolute bottom-3 left-3 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg',
    resetButton: 'leaflet-top leaflet-left',
    resetButtonInner: 'leaflet-control leaflet-bar',
    resetButtonElement: 'reset-zoom-button'
} as const;
