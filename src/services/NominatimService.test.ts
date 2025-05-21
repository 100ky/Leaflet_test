import { NominatimService } from './NominatimService';

(async () => {
    const service = new NominatimService();

    try {
        // Test geocodeAddress
        const address = 'ZEVO Malešice, Praha';
        const coordinates = await service.geocodeAddress(address);
        console.log(`Geocoded address: ${address}`);
        console.log(`Coordinates:`, coordinates);

        // Test reverseGeocode
        const lat = coordinates.lat;
        const lng = coordinates.lng;
        const resolvedAddress = await service.reverseGeocode(lat, lng);
        console.log(`Reverse geocoded coordinates: (${lat}, ${lng})`);
        console.log(`Resolved address:`, resolvedAddress);
    } catch (error) {
        console.error('Error during testing:', error);
    }
})();
