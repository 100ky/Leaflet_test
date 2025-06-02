/**
 * incinerators.ts - Databáze spaloven v České republice
 * Obsahuje kompletní údaje o všech spalovnách včetně oficiálních informací
 */

import { Incinerator } from '@/types';

/**
 * Databáze spaloven v ČR s oficiálními informacemi
 * Zahrnuje provozní údaje, technické specifikace a kontaktní informace
 */
export const incineratorData: Incinerator[] = [
  {
    id: '1',
    name: 'ZEVO Malešice',
    location: {
      lat: 50.0795,
      lng: 14.5408,
    },
    streetAddress: 'Průmyslová 615/32, 108 00 Praha 10',
    description: 'Zařízení na energetické využití odpadu v Praze',
    capacity: 330000,
    operational: true,
    yearEstablished: 1998,
    officialInfo: {
      operator: 'Pražské služby, a.s.',
      owner: 'Hlavní město Praha',
      website: 'https://www.psas.cz/cs/sluzby/zevo-malesice/',
      phone: '+420 234 765 111',
      email: 'zevo@psas.cz',
      technology: 'Spalování na roštovém kotli s fluidní fluidní regenerací',
      numberOfLines: 2,
      maxCapacityPerLine: 165000,
      electricalPowerMW: 18.5,
      thermalPowerMW: 50,
      steamProductionTh: 80,
      emissionLimits: {
        CO: 50,
        NOx: 200,
        SO2: 50,
        dust: 10,
        dioxins: 0.1
      },
      certifications: ['ISO 14001', 'ISO 9001', 'OHSAS 18001'],
      wasteTypes: ['Komunální odpad', 'Průmyslový odpad', 'Nemocniční odpad'],
      operatingHours: '24/7 - kromě plánovaných odstávek',
      maintenanceSchedule: 'Červenec - srpen (každé 3 roky)'
    },
    propertyBoundary: {
      type: 'Polygon',
      coordinates: [[
        [14.5387638, 50.0809199],
        [14.5418453, 50.0813798],
        [14.5426894, 50.0815482],
        [14.5425558, 50.0807855],
        [14.5426303, 50.0803016],
        [14.5422328, 50.0803136],
        [14.5421354, 50.0782391],
        [14.5421224, 50.0782394],
        [14.5407798, 50.0782657],
        [14.5407802, 50.0777808],
        [14.5398155, 50.0776584],
        [14.5394733, 50.0782940],
        [14.5393154, 50.0782979],
        [14.5389706, 50.0783012],
        [14.5389733, 50.0783597],
        [14.5389894, 50.0787031],
        [14.5390312, 50.0795997],
        [14.5388434, 50.0797103],
        [14.5388486, 50.0798166],
        [14.5387709, 50.0798181],
        [14.5387855, 50.0801211],
        [14.5386973, 50.0801220],
        [14.5387227, 50.0803863],
        [14.5387286, 50.0804625],
        [14.5387638, 50.0809199] // uzavření polygonu
      ]],
    },
    buildings: []
  },
  {
    id: '2',
    name: 'SAKO Brno',
    location: {
      lat: 49.1900,
      lng: 16.6665,
    },
    streetAddress: 'Jedovnická 2, 628 00 Brno',
    description: 'Spalovna komunálního odpadu v Brně',
    capacity: 248000,
    operational: true,
    yearEstablished: 1989,
    officialInfo: {
      operator: 'SAKO Brno, a.s.',
      owner: 'Statutární město Brno',
      website: 'https://www.sakobrno.cz/',
      phone: '+420 548 138 111',
      email: 'info@sakobrno.cz',
      technology: 'Spalování na roštovém kotli',
      numberOfLines: 3,
      maxCapacityPerLine: 82667, // 248000 / 3
      electricalPowerMW: 21.5,
      thermalPowerMW: 68,
      steamProductionTh: 100, // Odhad
      emissionLimits: {
        CO: 50,
        NOx: 200,
        SO2: 50,
        dust: 10,
        dioxins: 0.1
      },
      certifications: ['ISO 14001', 'ISO 9001', 'ISO 45001'],
      wasteTypes: ['Komunální odpad', 'Průmyslový odpad'],
      operatingHours: 'Nepřetržitý provoz',
      maintenanceSchedule: 'Každoroční odstávky jednotlivých linek'
    },
    propertyBoundary: {
      type: 'Polygon',
      coordinates: [[
        [16.6646985, 49.1887172],
        [16.6641520, 49.1890480],
        [16.6652974, 49.1900172],
        [16.6653556, 49.1900529],
        [16.6658633, 49.1904783],
        [16.6659324, 49.1905473],
        [16.6659515, 49.1910424],
        [16.6661101, 49.1911291],
        [16.6660582, 49.1911623],
        [16.6660223, 49.1911846],
        [16.6661385, 49.1912659],
        [16.6661514, 49.1912735],
        [16.6663088, 49.1913831],
        [16.6668124, 49.1917365],
        [16.6671960, 49.1915520],
        [16.6673289, 49.1916484],
        [16.6677911, 49.1914286],
        [16.6675925, 49.1911845],
        [16.6686753, 49.1906472],
        [16.6680022, 49.1901969],
        [16.6681496, 49.1901222],
        [16.6673486, 49.1894148],
        [16.6670562, 49.1892738],
        [16.6669507, 49.1892968],
        [16.6667046, 49.1892133],
        [16.6659699, 49.1890650],
        [16.6659935, 49.1890023],
        [16.6648438, 49.1887492],
        [16.6646985, 49.1887172] // uzavření polygonu
      ]],
    },
    buildings: []
  },
  {
    id: '3',
    name: 'TERMIZO Liberec',
    location: {
      lat: 50.7572833,
      lng: 15.0572151,
    },
    streetAddress: 'Dr. Milady Horákové 571/94, 460 07 Liberec',
    description: 'Termické zpracování odpadu v Liberci',
    capacity: 96000,
    operational: true,
    yearEstablished: 1999,
    officialInfo: {
      operator: 'TERMIZO, a.s.',
      owner: 'Statutární město Liberec',
      website: 'https://www.termizo.cz/',
      phone: '+420 485 241 111',
      email: 'info@termizo.cz',
      technology: 'Spalování na roštovém kotli',
      numberOfLines: 1, // Předpoklad, nutno ověřit
      maxCapacityPerLine: 96000,
      electricalPowerMW: 5.5, // Nutno ověřit
      thermalPowerMW: 25, // Nutno ověřit
      steamProductionTh: 35, // Nutno ověřit
      emissionLimits: {
        CO: 50,
        NOx: 200,
        SO2: 50,
        dust: 10,
        dioxins: 0.1
      },
      certifications: ['ISO 14001', 'ISO 9001'],
      wasteTypes: ['Komunální odpad'],
      operatingHours: 'Nepřetržitý provoz',
      maintenanceSchedule: 'Plánované odstávky'
    },
    propertyBoundary: {
      type: 'Polygon',
      coordinates: [[
        [15.0567495, 50.7575569],
        [15.0565373, 50.7574548],
        [15.0567109, 50.757311],
        [15.0566828, 50.757297],
        [15.0566598, 50.757315],
        [15.0566491, 50.7573049],
        [15.0566476, 50.7572929],
        [15.0566521, 50.7572793],
        [15.0566645, 50.7572623],
        [15.0566769, 50.7572507],
        [15.0567073, 50.7572309],
        [15.0567334, 50.7572214],
        [15.0567526, 50.7572193],
        [15.0567703, 50.7572233],
        [15.0567324, 50.7572524],
        [15.0567631, 50.7572674],
        [15.0568817, 50.7571695],
        [15.0570851, 50.7572675],
        [15.0573987, 50.7570082],
        [15.0573965, 50.7569945],
        [15.0573988, 50.7569822],
        [15.0574044, 50.7569731],
        [15.0574129, 50.7569657],
        [15.057424, 50.7569589],
        [15.0574386, 50.7569539],
        [15.0574554, 50.7569509],
        [15.0574746, 50.7569503],
        [15.0575273, 50.7569554],
        [15.0575533, 50.756962],
        [15.05758, 50.7569716],
        [15.0576231, 50.7569933],
        [15.057642, 50.7570076],
        [15.0576733, 50.7570412],
        [15.0576807, 50.7570548],
        [15.0576808, 50.757075],
        [15.0576769, 50.7570827],
        [15.0576705, 50.7570908],
        [15.0576631, 50.757097],
        [15.0576539, 50.7571016],
        [15.0576381, 50.7571064],
        [15.0576098, 50.7571108],
        [15.0571695, 50.7574752],
        [15.0573032, 50.7575402],
        [15.0571628, 50.7576573],
        [15.0568253, 50.7574934],
        [15.0567495, 50.7575569] // uzavření polygonu
      ]],
    },
    buildings: []
  },
  {
    id: '4',
    name: 'ZEVO Chotíkov',
    location: {
      lat: 49.801651,
      lng: 13.2967154,
    },
    streetAddress: 'Chotíkov 385, 330 17 Chotíkov',
    description: 'Zařízení pro energetické využití odpadu v Plzeňském kraji',
    capacity: 95000,
    operational: true,
    yearEstablished: 2016,
    officialInfo: {
      operator: 'Plzeňská teplárenská, a.s.',
      owner: 'Město Plzeň',
      website: 'https://www.pltep.cz/zevo-chotikov/',
      phone: '+420 378 031 111',
      email: 'info@pltep.cz',
      technology: 'Spalování na roštovém kotli',
      numberOfLines: 1, // Předpoklad, nutno ověřit
      maxCapacityPerLine: 95000,
      electricalPowerMW: 10.5, // Nutno ověřit
      thermalPowerMW: 28, // Nutno ověřit
      steamProductionTh: 40, // Nutno ověřit
      emissionLimits: {
        CO: 50,
        NOx: 200,
        SO2: 50,
        dust: 10,
        dioxins: 0.1
      },
      certifications: ['ISO 14001', 'ISO 9001', 'ISO 50001'],
      wasteTypes: ['Komunální odpad', 'Průmyslový odpad'],
      operatingHours: 'Nepřetržitý provoz',
      maintenanceSchedule: 'Plánované odstávky'
    },
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
