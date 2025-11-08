import L from 'leaflet';
/**
 * Custom icon definitions for incinerator map
 */

// Base configuration for all icons
const iconOptions = {
  iconSize: [25, 41] as L.PointExpression,
  iconAnchor: [12, 41] as L.PointExpression,
  popupAnchor: [1, -34] as L.PointExpression,
  shadowSize: [41, 41] as L.PointExpression
};

// Icons based on incinerator status
export const operationalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  ...iconOptions
});

export const plannedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  ...iconOptions
});

export const nonOperationalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  ...iconOptions
});

/**
 * Returns appropriate icon based on incinerator status
 * 
 * @param operational - is incinerator operational
 * @param planned - is incinerator planned
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
