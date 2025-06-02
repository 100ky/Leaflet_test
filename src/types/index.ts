/**
 * Oficiální provozní informace o spalovně
 */
export interface IncineratorOfficialInfo {
  operator: string;              // Provozovatel
  owner?: string;                // Vlastník (pokud se liší od provozovatele)
  licenseNumber?: string;        // Číslo povolení
  website?: string;              // Oficiální webové stránky
  phone?: string;                // Kontaktní telefon
  email?: string;                // Kontaktní email

  // Technické parametry
  technology: string;            // Technologie spalování
  numberOfLines: number;         // Počet linek
  maxCapacityPerLine?: number;   // Max. kapacita na linku (t/rok)

  // Energetické výstupy
  electricalPowerMW?: number;    // Elektrický výkon (MW)
  thermalPowerMW?: number;       // Tepelný výkon (MW)
  steamProductionTh?: number;    // Produkce páry (t/h)

  // Environmentální data
  emissionLimits?: {
    CO?: number;                 // Oxid uhelnatý (mg/m³)
    NOx?: number;                // Oxidy dusíku (mg/m³)
    SO2?: number;                // Oxid siřičitý (mg/m³)
    dust?: number;               // Prach (mg/m³)
    dioxins?: number;            // Dioxiny (ng/m³)
  };

  // Certifikace
  certifications?: string[];     // ISO certifikace, environmentální značky atd.

  // Zpracovávané odpady
  wasteTypes: string[];          // Typy zpracovávaných odpadů

  // Provozní údaje
  operatingHours?: string;       // Provozní doba
  maintenanceSchedule?: string;  // Plánované odstávky
}

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
  officialInfo?: IncineratorOfficialInfo; // Oficiální informace
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