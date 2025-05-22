/**
 * Reprezentace spalovny se všemi jejími atributy
 */
export interface Incinerator {
  id: string;                 // Unikátní identifikátor
  name: string;               // Název spalovny
  location: {                 // Geografická poloha
    lat: number;              // Zeměpisná šířka
    lng: number;              // Zeměpisná délka
  };
  streetAddress?: string;     // Adresa
  description?: string;       // Popis
  capacity?: number;          // Kapacita (t/rok)
  operational: boolean;       // Provozní stav
  yearEstablished?: number;   // Rok založení
  propertyBoundary?: GeoJSONPolygon; // Hranice pozemku
  buildings?: Building[];     // Budovy a části
}

/**
 * Filtry pro zobrazení spaloven
 */
export interface IncineratorFilters {
  showOperational: boolean;    // Zobrazit v provozu
  showNonOperational: boolean; // Zobrazit mimo provoz
  minCapacity?: number;        // Minimální kapacita
  maxCapacity?: number;        // Maximální kapacita
}

/**
 * Budova nebo část spalovny
 */
export interface Building {
  id: string;                // Identifikátor
  name: string;              // Název
  type: BuildingType;        // Typ
  description?: string;      // Popis funkce
  geometry: GeoJSONPolygon;  // Tvar
  details?: {                // Detaily
    yearBuilt?: number;      // Rok výstavby
    areaInSqMeters?: number; // Rozloha v m²
    function?: string;       // Funkce
  }
}

/**
 * Typy částí spalovny
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
 * GeoJSON polygon pro geografická data
 */
export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}