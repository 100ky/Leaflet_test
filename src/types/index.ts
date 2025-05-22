/**
 * Typ reprezentující spalovnu
 * Obsahuje všechny důležité informace o jednotlivých spalovnách
 */
export interface Incinerator {
  id: string;                 // Unikátní identifikátor spalovny
  name: string;               // Název spalovny
  location: {                 // Geografická poloha spalovny
    lat: number;              // Zeměpisná šířka (latitude)
    lng: number;              // Zeměpisná délka (longitude)
  };
  streetAddress?: string;     // Přidáno: adresa spalovny
  description?: string;       // Popis spalovny (volitelný)
  capacity?: number;          // Kapacita v tunách za rok (volitelná)
  operational: boolean;       // Provozní stav (true = v provozu, false = mimo provoz)
  yearEstablished?: number;   // Rok založení/uvedení do provozu (volitelný)
  propertyBoundary?: GeoJSONPolygon; // Obrys celého pozemku spalovny
  buildings?: Building[];     // Budovy a části spalovny
}

/**
 * Typ pro filtrování spaloven
 * Používá se pro nastavení filtrů v uživatelském rozhraní
 */
export interface IncineratorFilters {
  showOperational: boolean;    // Zobrazit spalovny v provozu
  showNonOperational: boolean; // Zobrazit spalovny mimo provoz
  minCapacity?: number;        // Minimální kapacita pro filtrování (volitelné)
  maxCapacity?: number;        // Maximální kapacita pro filtrování (volitelné)
}

/**
 * Typ pro budovu nebo část spalovny
 */
export interface Building {
  id: string;                // Unikátní identifikátor budovy
  name: string;              // Název budovy/části
  type: BuildingType;        // Typ budovy
  description?: string;      // Popis činnosti/účelu budovy
  geometry: GeoJSONPolygon;  // Geometrický tvar budovy 
  details?: {                // Další volitelné informace
    yearBuilt?: number;      // Rok výstavby
    areaInSqMeters?: number; // Rozloha v m²
    function?: string;       // Hlavní funkce budovy
  }
}

/**
 * Typy budov nebo částí spalovny
 */
export enum BuildingType {
  MainBuilding = 'MAIN_BUILDING',          // Hlavní budova
  ProcessingUnit = 'PROCESSING_UNIT',      // Procesní jednotka
  StorageArea = 'STORAGE_AREA',            // Skladovací prostory
  AdministrativeBuilding = 'ADMIN',        // Administrativní budova
  ChimneyStack = 'CHIMNEY',                // Komín
  WasteBunker = 'WASTE_BUNKER',            // Zásobník odpadu
  AshStorage = 'ASH_STORAGE'               // Sklad popílku
}

/**
 * GeoJSON polygon
 */
export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}