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
  description?: string;       // Popis spalovny (volitelný)
  capacity?: number;          // Kapacita v tunách za rok (volitelná)
  operational: boolean;       // Provozní stav (true = v provozu, false = mimo provoz)
  yearEstablished?: number;   // Rok založení/uvedení do provozu (volitelný)
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