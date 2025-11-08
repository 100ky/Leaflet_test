
// Main page component for the incinerator map webapp
import MapWrapper from "@/components/map/MapWrapper";
import type { Incinerator } from "@/types/incinerator";

// Exported async component for Next.js
export default async function Page() {
  const apiUrl = process.env.REMOTE_API_BASE_URL;
  // Fetch incinerator data from remote API (no caching)
  const res = await fetch(`${apiUrl}/incinerators`, {
    cache: "no-store",
  });

  // Parse response as array of Incinerator objects
  const incinerators: Incinerator[] = await res.json();

  // Render the map with incinerator data
  return <MapWrapper incinerators={incinerators} />;
}
