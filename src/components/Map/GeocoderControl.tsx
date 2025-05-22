import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-control-geocoder';

export function GeocoderControl() {
    const map = useMap();
    useEffect(() => {
        // @ts-expect-error: leaflet-control-geocoder nemá typy v L.Control
        if (L.Control.Geocoder) {
            // @ts-expect-error: leaflet-control-geocoder nemá typy v L.Control
            const geocoder = L.Control.geocoder({
                defaultMarkGeocode: true,
            });
            geocoder.addTo(map);
        }
    }, [map]);
    return null;
}
