/**
 * Map - Hlavní komponenta pro zobrazení interaktivní mapy
 * Obsahuje Leaflet mapu s markery spaloven, popup okna a ovládací prvky
 */

'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import './Map.css';
import { Incinerator } from '@/types';
import { MAP_CONSTANTS } from '@/utils/mapHelpers';

// Dynamický import MapClient komponenty pro SSR compatibility
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