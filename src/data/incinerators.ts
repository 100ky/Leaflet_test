import { Incinerator, BuildingType } from '@/types';

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
    // Obrys celého areálu
    propertyBoundary: {
      type: 'Polygon',
      coordinates: [[
        [14.5143, 50.0865],
        [14.5163, 50.0865],
        [14.5163, 50.0885],
        [14.5143, 50.0885],
        [14.5143, 50.0865]
      ]]
    },
    // Data jednotlivých budov
    buildings: [
      {
        id: 'zevo-main',
        name: 'Hlavní budova',
        type: BuildingType.MainBuilding,
        description: 'Hlavní provozní budova s kotli a turbínou',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [14.5148, 50.0870],
            [14.5158, 50.0870],
            [14.5158, 50.0880],
            [14.5148, 50.0880],
            [14.5148, 50.0870]
          ]]
        },
        details: {
          yearBuilt: 1998,
          areaInSqMeters: 5200,
          function: 'Hlavní výrobní proces'
        }
      },
      {
        id: 'zevo-chimney',
        name: 'Komín',
        type: BuildingType.ChimneyStack,
        description: 'Hlavní komín spalovny, výška 177m',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [14.5153, 50.0876],
            [14.5154, 50.0876],
            [14.5154, 50.0877],
            [14.5153, 50.0877],
            [14.5153, 50.0876]
          ]]
        },
        details: {
          yearBuilt: 1998,
          function: 'Odvod spalin'
        }
      },
      {
        id: 'zevo-storage',
        name: 'Skládka odpadu',
        type: BuildingType.WasteBunker,
        description: 'Prostor pro dočasné skladování odpadu před zpracováním',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [14.5145, 50.0872],
            [14.5148, 50.0872],
            [14.5148, 50.0876],
            [14.5145, 50.0876],
            [14.5145, 50.0872]
          ]]
        },
        details: {
          yearBuilt: 1998,
          areaInSqMeters: 3200,
          function: 'Skladování odpadu'
        }
      }
    ]
  },
  
  // Druhá spalovna - SAKO Brno
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
    propertyBoundary: {
      type: 'Polygon',
      coordinates: [[
        [16.6556, 49.1836],
        [16.6576, 49.1836],
        [16.6576, 49.1846],
        [16.6556, 49.1846],
        [16.6556, 49.1836]
      ]]
    },
    buildings: [
      {
        id: 'sako-main',
        name: 'Hlavní budova',
        type: BuildingType.MainBuilding,
        description: 'Hlavní technologický provoz',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [16.6561, 49.1839],
            [16.6571, 49.1839],
            [16.6571, 49.1843],
            [16.6561, 49.1843],
            [16.6561, 49.1839]
          ]]
        },
        details: {
          yearBuilt: 1989,
          areaInSqMeters: 4800,
          function: 'Spalování odpadu'
        }
      },
      {
        id: 'sako-admin',
        name: 'Administrativní budova',
        type: BuildingType.AdministrativeBuilding,
        description: 'Kanceláře a návštěvnické centrum',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [16.6558, 49.1844],
            [16.6564, 49.1844],
            [16.6564, 49.1845],
            [16.6558, 49.1845],
            [16.6558, 49.1844]
          ]]
        }
      }
    ]
  },

  // Třetí spalovna - TERMIZO Liberec
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
    propertyBoundary: {
      type: 'Polygon',
      coordinates: [[
        [15.0479, 50.7540],
        [15.0499, 50.7540],
        [15.0499, 50.7550],
        [15.0479, 50.7550],
        [15.0479, 50.7540]
      ]]
    },
    buildings: [
      {
        id: 'termizo-processing',
        name: 'Procesní jednotka',
        type: BuildingType.ProcessingUnit,
        description: 'Hlavní technologická jednotka',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [15.0484, 50.7543],
            [15.0494, 50.7543],
            [15.0494, 50.7547],
            [15.0484, 50.7547],
            [15.0484, 50.7543]
          ]]
        }
      },
      {
        id: 'termizo-chimney',
        name: 'Komín',
        type: BuildingType.ChimneyStack,
        description: 'Komín odvodu spalin',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [15.0489, 50.7548],
            [15.0490, 50.7548],
            [15.0490, 50.7549],
            [15.0489, 50.7549],
            [15.0489, 50.7548]
          ]]
        }
      }
    ]
  },

  // Čtvrtá spalovna - ZEVO Chotíkov
  {
    id: '4',
    name: 'ZEVO Chotíkov',
    location: {
      lat: 49.7988,
      lng: 13.2946,
    },
    description: 'Zařízení pro energetické využití odpadu v Plzeňském kraji',
    capacity: 95000,
    operational: true,
    yearEstablished: 2016,
    propertyBoundary: {
      type: 'Polygon',
      coordinates: [[
        [13.2936, 49.7983],
        [13.2956, 49.7983],
        [13.2956, 49.7993],
        [13.2936, 49.7993],
        [13.2936, 49.7983]
      ]]
    },
    buildings: [
      {
        id: 'chotikov-main',
        name: 'Hlavní hala',
        type: BuildingType.MainBuilding,
        description: 'Hlavní provozní hala s technologií',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [13.2941, 49.7986],
            [13.2951, 49.7986],
            [13.2951, 49.7990],
            [13.2941, 49.7990],
            [13.2941, 49.7986]
          ]]
        },
        details: {
          yearBuilt: 2016,
          areaInSqMeters: 3800,
          function: 'Energetické využití odpadu'
        }
      }
    ]
  },

  // Pátá spalovna - Plánovaná spalovna Ostrava
  {
    id: '5',
    name: 'Plánovaná spalovna Ostrava',
    location: {
      lat: 49.8209,
      lng: 18.2625,
    },
    description: 'Plánovaná spalovna komunálního odpadu v Moravskoslezském kraji',
    capacity: 180000,
    operational: false,
    yearEstablished: 2026,
    propertyBoundary: {
      type: 'Polygon',
      coordinates: [[
        [18.2615, 49.8204],
        [18.2635, 49.8204],
        [18.2635, 49.8214],
        [18.2615, 49.8214],
        [18.2615, 49.8204]
      ]]
    }
  }
];

export default incineratorData;