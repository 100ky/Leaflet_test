/**
 * Type definition for an incinerator (waste-to-energy plant) used in the project.
 */
export interface Incinerator {
  id: number;
  name: string | null;
  location: {
    lat: number;
    lng: number;
  };
  streetAddress: string | null;
  description: string | null;
  capacity: number | null;
  operational: boolean;
  yearEstablished: number;
  propertyBoundary: unknown;
  buildings: unknown[];
}
