import { Incinerator } from '@/types';

/**
 * Vzorová data spaloven v České republice
 */
export const incineratorData: Incinerator[] = [
  {
    id: '1',
    name: 'ZEVO Malešice',
    location: {
      lat: 50.0875,
      lng: 14.5153,
    },
    description: 'Zařízení na energetické využití odpadu v Praze',
    capacity: 330000,
    operational: true,
    yearEstablished: 1998,
    propertyBoundary: undefined,
    buildings: []
  },
  {
    id: '2',
    name: 'SAKO Brno',
    location: {
      lat: 49.1841,
      lng: 16.6566,
    },
    description: 'Spalovna komunálního odpadu v Brně',
    capacity: 248000,
    operational: true,
    yearEstablished: 1989,
    propertyBoundary: undefined,
    buildings: []
  },
  {
    id: '3',
    name: 'TERMIZO Liberec',
    location: {
      lat: 50.7545,
      lng: 15.0489,
    },
    description: 'Termické zpracování odpadu v Liberci',
    capacity: 96000,
    operational: true,
    yearEstablished: 1999,
    propertyBoundary: undefined,
    buildings: []
  },
  {
    id: '4',
    name: 'ZEVO Chotíkov',
    location: {
      lat: 49.801651, // přesné souřadnice podle OSM (viz screenshot)
      lng: 13.2967154,
    },
    description: 'Zařízení pro energetické využití odpadu v Plzeňském kraji',
    capacity: 95000,
    operational: true,
    yearEstablished: 2016,
    propertyBoundary: {
      type: 'Polygon',
      coordinates: [[
        // Skutečný tvar areálu spalovny Chotíkov z OpenStreetMap
        [13.2952655, 49.8019319],
        [13.2951457, 49.8019578],
        [13.2959898, 49.8017722],
        [13.2960622, 49.8019101],
        [13.2961656, 49.8018874],
        [13.2960932, 49.8017495],
        [13.2963840, 49.8016855],
        [13.2963801, 49.8016782],
        [13.2967769, 49.8015905],
        [13.2967948, 49.8015967],
        [13.2968668, 49.8017339],
        [13.2969736, 49.8017109],
        [13.2969986, 49.8017616],
        [13.2971438, 49.8017299],
        [13.2971928, 49.8017789],
        [13.2972294, 49.8018281],
        [13.2972555, 49.8018792],
        [13.2972726, 49.8019327],
        [13.2972798, 49.8019881],
        [13.2972758, 49.8020485],
        [13.2971637, 49.8020731],
        [13.2971903, 49.8021235],
        [13.2971118, 49.8021407],
        [13.2971425, 49.8022008],
        [13.2969581, 49.8022415],
        [13.2968063, 49.8019545],
        [13.2963297, 49.8020585],
        [13.2963141, 49.8020320],
        [13.2961447, 49.8020701],
        [13.2960614, 49.8020922],
        [13.2959864, 49.8021166],
        [13.2959127, 49.8021442],
        [13.2958374, 49.8021684],
        [13.2957596, 49.8021890],
        [13.2956805, 49.8022053],
        [13.2955988, 49.8022173],
        [13.2955148, 49.8022255],
        [13.2954213, 49.8022305],
        [13.2953361, 49.8020680],
        [13.2952163, 49.8020939],
        [13.2952655, 49.8019319]  // uzavírá polygon - první a poslední bod musí být stejné
      ]],
    },
    buildings: []
  }
];

// Oprava: všechny body jsou ve formátu { lat, lng } (lat = zeměpisná šířka, lng = délka)
export default incineratorData;
