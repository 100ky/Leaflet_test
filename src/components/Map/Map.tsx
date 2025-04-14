'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
// Importy pro správné zobrazení Leaflet mapy a ikon
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { Incinerator } from '@/types';
// Import vlastních ikon pro spalovny
import { getIncineratorIcon } from './mapIcons';

// Vlastní CSS pro mapu - určuje rozměry mapového kontejneru
const mapStyle = {
  height: '600px', // Výška mapy
  width: '100%',   // Šířka na 100% rodičovského prvku
};

// Definice props komponenty
interface MapProps {
  incinerators: Incinerator[]; // Pole spaloven, které budou zobrazeny na mapě
}

/**
 * Komponenta zobrazující mapu se spalovnami
 * 
 * @param incinerators - pole obsahující data o spalovnách
 */
const Map = ({ incinerators }: MapProps) => {
  // Stavová proměnná pro kontrolu, zda je komponenta připojena k DOMu
  // Řeší problém při SSR (server-side renderingu), protože Leaflet potřebuje přístup k window objektu
  const [isMounted, setIsMounted] = useState(false);
  
  // Po připojení komponenty do DOMu nastavíme isMounted na true
  useEffect(() => {
    setIsMounted(true);
  }, []);

  /**
   * Funkce pro výpočet středu mapy na základě pozic spaloven
   * Pokud nejsou k dispozici žádné spalovny, zobrazí se střed Prahy
   */
  const calculateMapCenter = () => {
    if (!incinerators || incinerators.length === 0) {
      // Výchozí střed - Praha
      return [50.07, 14.43];
    }

    // Průměr všech souřadnic - jednoduchý algoritmus pro nalezení středu
    const sumLat = incinerators.reduce((sum, inc) => sum + inc.location.lat, 0);
    const sumLng = incinerators.reduce((sum, inc) => sum + inc.location.lng, 0);
    
    return [sumLat / incinerators.length, sumLng / incinerators.length];
  };

  // Vypočítáme střed mapy
  const mapCenter = calculateMapCenter();
  
  // Pokud komponenta není připojena k DOMu, vrátíme prázdný div se správnými rozměry
  if (!isMounted) {
    return <div style={mapStyle}></div>;
  }
  
  /**
   * Funkce pro určení, zda je spalovna plánovaná
   * Kontroluje, zda rok založení je v budoucnosti
   */
  const isPlannedIncinerator = (incinerator: Incinerator): boolean => {
    const currentYear = new Date().getFullYear();
    return !incinerator.operational && incinerator.yearEstablished !== undefined && 
           incinerator.yearEstablished > currentYear;
  };
  
  // Vykreslení Leaflet mapy
  return (
    <MapContainer 
      center={[mapCenter[0], mapCenter[1]]} // Střed mapy
      zoom={7}                              // Úroveň přiblížení (zoom)
      style={mapStyle}                      // Rozměry mapy
      scrollWheelZoom={true}                // Povolení přibližování pomocí kolečka myši
    >
      {/* Vrstva s mapovými podklady - používá OpenStreetMap */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Vykreslení značek pro každou spalovnu s vlastními ikonami */}
      {incinerators.map((incinerator) => {
        // Určení typu ikony podle stavu spalovny
        const isPlanned = isPlannedIncinerator(incinerator);
        const icon = getIncineratorIcon(incinerator.operational, isPlanned);
        
        return (
          <Marker 
            key={incinerator.id}
            position={[incinerator.location.lat, incinerator.location.lng]}
            icon={icon} // Použití vlastní ikony podle stavu
          >
            {/* Vyskakovací okno (popup) po kliknutí na značku */}
            <Popup>
              <div>
                <h3>{incinerator.name}</h3>
                <p>{incinerator.description}</p>
                <p>Kapacita: {incinerator.capacity} tun/rok</p>
                <p>Stav: {
                  incinerator.operational 
                    ? 'V provozu' 
                    : (isPlanned ? 'Plánovaná výstavba' : 'Mimo provoz')
                }</p>
                <p>Založeno: {incinerator.yearEstablished || 'Neznámo'}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;