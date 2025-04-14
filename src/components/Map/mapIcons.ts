'use client';

import L from 'leaflet';

/**
 * Vlastní ikony pro mapu spaloven
 * Používá se pro rozlišení různých typů spaloven
 */

// Základní vlastnosti ikony
const iconOptions = {
  iconSize: [25, 41],       // velikost ikony
  iconAnchor: [12, 41],     // bod, kterým se ikona připojí k poloze značky
  popupAnchor: [1, -34],    // bod, od kterého se má zobrazit popup
  shadowSize: [41, 41]      // velikost stínu
};

// Ikona pro spalovny v provozu (zelená)
export const operationalIcon = new L.Icon({
  iconUrl: '/images/marker-operational.png',
  shadowUrl: '/images/marker-shadow.png',
  ...iconOptions
});

// Ikona pro plánované spalovny (modrá)
export const plannedIcon = new L.Icon({
  iconUrl: '/images/marker-planned.png',
  shadowUrl: '/images/marker-shadow.png',
  ...iconOptions
});

// Ikona pro spalovny mimo provoz (červená)
export const nonOperationalIcon = new L.Icon({
  iconUrl: '/images/marker-nonoperational.png',
  shadowUrl: '/images/marker-shadow.png',
  ...iconOptions
});

/**
 * Funkce, která vrátí správnou ikonu podle stavu spalovny
 * 
 * @param operational - zda je spalovna v provozu
 * @param planned - zda je spalovna plánovaná (používá se pouze pokud operational je false)
 * @returns - příslušná ikona pro Leaflet značku
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

export default {
  operationalIcon,
  plannedIcon,
  nonOperationalIcon,
  getIncineratorIcon
};