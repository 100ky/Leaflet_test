// This component ensures the map is rendered only on the client (browser)
"use client";
import dynamic from "next/dynamic";
import { Incinerator } from "@/types/incinerator";

// Dynamically import the Map component so it only renders on the client (no SSR)
const Map = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-gray-100">
      <div className="text-gray-600">Loading map...</div>
    </div>
  ),
});

// Props for the MapWrapper component: expects an array of incinerators
type MapWrapperProps = {
  incinerators: Incinerator[];
};

// Renders the map, filling the viewport minus the header height
export default function MapWrapper({ incinerators }: MapWrapperProps) {
  return (
    <div className="h-[calc(100vh-96px)] w-full md:h-[calc(100vh-80px)]">
      <Map incinerators={incinerators} />
    </div>
  );
}
