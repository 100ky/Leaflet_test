import { Incinerator, BuildingType } from '@/types';

/**
 * Vzorová data spaloven v České republice
 */
export const incineratorData: Incinerator[] = [{
  id: '1',
  name: 'ZEVO Malešice',
  location: {
    lat: 50.079655,
    lng: 14.5405696,
  },
  description: 'Zařízení na energetické využití odpadu v Praze',
  capacity: 330000,
  operational: true,
  yearEstablished: 1998,
  // Obrys celého areálu
  propertyBoundary: {
    type: 'Polygon',
    coordinates: [[
      [14.539570, 50.078655],
      [14.541570, 50.078655],
      [14.541570, 50.080655],
      [14.539570, 50.080655],
      [14.539570, 50.078655]
    ]]
  },
  // Data jednotlivých budov
  buildings: [{
    id: 'zevo-main',
    name: 'Hlavní budova',
    type: BuildingType.MainBuilding,
    description: 'Hlavní provozní budova s kotli a turbínou',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [14.540070, 50.079155],
        [14.541070, 50.079155],
        [14.541070, 50.080155],
        [14.540070, 50.080155],
        [14.540070, 50.079155]
      ]]
    },
    details: {
      yearBuilt: 1998,
      areaInSqMeters: 5200,
      function: 'Hlavní výrobní proces'
    }
  }, {
    id: 'zevo-chimney',
    name: 'Komín',
    type: BuildingType.ChimneyStack,
    description: 'Hlavní komín spalovny, výška 177m',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [14.540570, 50.079755],
        [14.540670, 50.079755],
        [14.540670, 50.079855],
        [14.540570, 50.079855],
        [14.540570, 50.079755]
      ]]
    },
    details: {
      yearBuilt: 1998,
      function: 'Odvod spalin'
    }
  }, {
    id: 'zevo-storage',
    name: 'Skládka odpadu',
    type: BuildingType.WasteBunker,
    description: 'Prostor pro dočasné skladování odpadu před zpracováním',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [14.539770, 50.079355],
        [14.540070, 50.079355],
        [14.540070, 50.079755],
        [14.539770, 50.079755],
        [14.539770, 50.079355]
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
    lat: 49.18944,
    lng: 16.65713,
  },
  description: 'Spalovna komunálního odpadu v Brně',
  capacity: 248000,
  operational: true,
  yearEstablished: 1989,
  propertyBoundary: {
    type: 'Polygon',
    coordinates: [[
      [16.6553, 49.1886],
      [16.6573, 49.1886],
      [16.6573, 49.1896],
      [16.6553, 49.1896],
      [16.6553, 49.1886]
    ]]
  }, buildings: [
    {
      id: 'sako-main',
      name: 'Hlavní budova',
      type: BuildingType.MainBuilding,
      description: 'Hlavní technologický provoz',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [16.6558, 49.1889],
          [16.6568, 49.1889],
          [16.6568, 49.1893],
          [16.6558, 49.1893],
          [16.6558, 49.1889]
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
          [16.6555, 49.1894],
          [16.6561, 49.1894],
          [16.6561, 49.1895],
          [16.6555, 49.1895],
          [16.6555, 49.1894]
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
    lat: 50.7626,
    lng: 15.0562,
  },
  description: 'Termické zpracování odpadu v Liberci',
  capacity: 96000,
  operational: true,
  yearEstablished: 1999,
  propertyBoundary: {
    type: 'Polygon',
    coordinates: [[
      [15.0552, 50.7621],
      [15.0572, 50.7621],
      [15.0572, 50.7631],
      [15.0552, 50.7631],
      [15.0552, 50.7621]
    ]]
  }, buildings: [
    {
      id: 'termizo-processing',
      name: 'Procesní jednotka',
      type: BuildingType.ProcessingUnit,
      description: 'Hlavní technologická jednotka',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [15.0557, 50.7624],
          [15.0567, 50.7624],
          [15.0567, 50.7628],
          [15.0557, 50.7628],
          [15.0557, 50.7624]
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
          [15.0562, 50.7629],
          [15.0563, 50.7629],
          [15.0563, 50.7630],
          [15.0562, 50.7630],
          [15.0562, 50.7629]
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
    lat: 49.7973,
    lng: 13.2877,
  },
  description: 'Zařízení pro energetické využití odpadu v Plzeňském kraji',
  capacity: 95000,
  operational: true,
  yearEstablished: 2016,
  propertyBoundary: {
    type: 'Polygon',
    coordinates: [[
      [13.2867, 49.7968],
      [13.2887, 49.7968],
      [13.2887, 49.7978],
      [13.2867, 49.7978],
      [13.2867, 49.7968]
    ]]
  }, buildings: [
    {
      id: 'chotikov-main',
      name: 'Hlavní hala',
      type: BuildingType.MainBuilding,
      description: 'Hlavní provozní hala s technologií',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [13.2872, 49.7971],
          [13.2882, 49.7971],
          [13.2882, 49.7975],
          [13.2872, 49.7975],
          [13.2872, 49.7971]
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
    lat: 49.8283,
    lng: 18.2652,
  },
  description: 'Plánovaná spalovna komunálního odpadu v Moravskoslezském kraji',
  capacity: 180000,
  operational: false,
  yearEstablished: 2026, propertyBoundary: {
    type: 'Polygon',
    coordinates: [[
      [18.2642, 49.8278],
      [18.2662, 49.8278],
      [18.2662, 49.8288],
      [18.2642, 49.8288],
      [18.2642, 49.8278]
    ]]
  }
},

// Šestá spalovna - ZEVO Plzeň
{
  id: '6',
  name: 'ZEVO Plzeň',
  location: {
    lat: 49.7572,
    lng: 13.3635,
  },
  description: 'Zařízení pro energetické využití odpadu v Plzni',
  capacity: 95000,
  operational: true,
  yearEstablished: 2002,
  propertyBoundary: {
    type: 'Polygon',
    coordinates: [[
      [13.3625, 49.7567],
      [13.3645, 49.7567],
      [13.3645, 49.7577],
      [13.3625, 49.7577],
      [13.3625, 49.7567]
    ]]
  },
  buildings: [
    {
      id: 'plzen-main',
      name: 'Hlavní budova',
      type: BuildingType.MainBuilding,
      description: 'Hlavní technologická jednotka',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [13.3630, 49.7570],
          [13.3640, 49.7570],
          [13.3640, 49.7574],
          [13.3630, 49.7574],
          [13.3630, 49.7570]
        ]]
      },
      details: {
        yearBuilt: 2002,
        areaInSqMeters: 4200,
        function: 'Energetické využití odpadu'
      }
    }, {
      id: 'plzen-chimney',
      name: 'Komín',
      type: BuildingType.ChimneyStack,
      description: 'Komín odvodu spalin',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [13.3635, 49.7575],
          [13.3636, 49.7575],
          [13.3636, 49.7576],
          [13.3635, 49.7576],
          [13.3635, 49.7575]
        ]]
      }
    }
  ]
},

// Sedmá spalovna - ECOREC Martin (Slovensko)
{
  id: '7',
  name: 'ECOREC Martin',
  location: {
    lat: 49.0662,
    lng: 18.9272,
  },
  description: 'Zařízení pro energetické využití odpadu ve slovenském Martině',
  capacity: 120000,
  operational: true,
  yearEstablished: 1995,
  propertyBoundary: {
    type: 'Polygon',
    coordinates: [[
      [18.9262, 49.0657],
      [18.9282, 49.0657],
      [18.9282, 49.0667],
      [18.9262, 49.0667],
      [18.9262, 49.0657]
    ]]
  },
  buildings: [
    {
      id: 'martin-main',
      name: 'Hlavní budova',
      type: BuildingType.MainBuilding,
      description: 'Hlavní technologická jednotka',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [18.9267, 49.0660],
          [18.9277, 49.0660],
          [18.9277, 49.0664],
          [18.9267, 49.0664],
          [18.9267, 49.0660]
        ]]
      },
      details: {
        yearBuilt: 1995,
        areaInSqMeters: 3500,
        function: 'Energetické využití odpadu'
      }
    }
  ]
}
];

export default incineratorData;