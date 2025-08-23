/**
 * Main map component for the Czech incinerators application
 */

import "./Map.css";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { memo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { getIncineratorIcon } from "./mapIcons";
import {
  isPlannedIncinerator,
  MAP_CONSTANTS,
  createIncineratorPopupContent,
} from "@/utils/mapHelpers";
import { Incinerator } from "@/types/incinerator";

// Fix icon initialization for Leaflet compatibility in Next.js SSR
// @see https://github.com/Leaflet/Leaflet/issues/7255
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;

interface MapProps {
  incinerators?: Incinerator[];
}

const Map = memo(({ incinerators }: MapProps) => {
  return (
    <div className="map-container" style={MAP_CONSTANTS.MAP_STYLE}>
      <MapContainer
        center={MAP_CONSTANTS.DEFAULT_CENTER}
        zoom={MAP_CONSTANTS.DEFAULT_ZOOM}
        minZoom={MAP_CONSTANTS.MIN_ZOOM}
        maxZoom={MAP_CONSTANTS.MAX_ZOOM}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {(incinerators || [])
          .filter(
            (i) =>
              i.location &&
              typeof i.location.lat === "number" &&
              typeof i.location.lng === "number",
          )
          .map((incinerator) => (
            <Marker
              key={incinerator.id}
              position={[incinerator.location.lat, incinerator.location.lng]}
              icon={getIncineratorIcon(
                incinerator.operational,
                isPlannedIncinerator(incinerator),
              )}
            >
              <Popup>
                <div
                  dangerouslySetInnerHTML={{
                    __html: createIncineratorPopupContent(incinerator),
                  }}
                />
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
});

Map.displayName = "Map";

export default Map;
