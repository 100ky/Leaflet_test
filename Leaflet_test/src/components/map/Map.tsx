/**
 * Hlavní mapová komponenta aplikace České spalovny
 * 
 * Zobrazuje interaktivní Leaflet mapu s následujícími funkcemi:
 * - Markery spaloven s barevným rozlišením podle stavu
 * - Popup okna s detailními informacemi o spalovně
 * - Ovládací prvky pro zoom a navigaci
 * - Dynamické načítání dat při změně viewport
 * 
 * Komponenta je SSR safe pomocí dynamic importu.
 * 
 * @component
 */

'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import './Map.css';
import { Incinerator } from '@/types';
import { MAP_CONSTANTS } from '@/utils/mapHelpers';

// Dynamický import MapClient komponenty pro SSR kompatibilitu
const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div
      style={MAP_CONSTANTS.MAP_STYLE}
      className="flex items-center justify-center bg-gray-100"
    >
      <div className="text-gray-600">Načítání mapy...</div>
    </div>
  )
});

interface MapProps {
  // Prop incinerators je nyní volitelný, protože se načítají dynamicky
  incinerators?: Incinerator[];
}

/**
 * Komponenta Map zobrazující interaktivní mapu spaloven s dynamickým načítáním dat
 */
const Map = ({ incinerators }: MapProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        style={MAP_CONSTANTS.MAP_STYLE}
        className="flex items-center justify-center bg-gray-100"
      >
        <div className="text-gray-600">Načítání mapy...</div>
      </div>
    );
  }

  return <MapClient incinerators={incinerators} />;
};

export { Map };
export default Map;