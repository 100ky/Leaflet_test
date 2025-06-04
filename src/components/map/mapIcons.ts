'use client';

import L from 'leaflet';

/**
 * Definice vlastních ikon pro mapu spaloven
 */

// Základní konfigurace pro všechny ikony
const iconOptions = {
  iconSize: [25, 41] as L.PointExpression,
  iconAnchor: [12, 41] as L.PointExpression,
  popupAnchor: [1, -34] as L.PointExpression,
  shadowSize: [41, 41] as L.PointExpression
};

// Ikony podle stavu spalovny
export const operationalIcon = new L.Icon({
  iconUrl: '/images/marker-operational.png',
  shadowUrl: '/images/marker-shadow.png',
  ...iconOptions
});

export const plannedIcon = new L.Icon({
  iconUrl: '/images/marker-planned.png',
  shadowUrl: '/images/marker-shadow.png',
  ...iconOptions
});

export const nonOperationalIcon = new L.Icon({
  iconUrl: '/images/marker-nonoperational.png',
  shadowUrl: '/images/marker-shadow.png',
  ...iconOptions
});

/**
 * Vrací odpovídající ikonu podle stavu spalovny
 * 
 * @param operational - je spalovna v provozu
 * @param planned - je spalovna plánovaná
 */
export const getIncineratorIcon = (operational: boolean, planned: boolean = false) => {
  if (operational) {
    return operationalIcon;
  } else if (planned) {
    return plannedIcon;
  } else {
    return nonOperationalIcon;
  }
};