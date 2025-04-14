import { Incinerator } from '../types';

/**
 * Vzorová data spaloven v České republice
 * Obsahuje základní informace o existujících a plánovaných spalovnách
 * V reálné aplikaci by tato data mohla pocházet z API
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
    capacity: 330000, // kapacita v tunách za rok
    operational: true, // spalovna je v provozu
    yearEstablished: 1998, // rok založení
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
  },
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
  },
  {
    id: '5',
    name: 'Plánovaná spalovna Ostrava',
    location: {
      lat: 49.8209,
      lng: 18.2625,
    },
    description: 'Plánovaná spalovna komunálního odpadu v Moravskoslezském kraji',
    capacity: 180000,
    operational: false, // spalovna zatím není v provozu
    yearEstablished: 2026, // plánované dokončení
  },
];

export default incineratorData;