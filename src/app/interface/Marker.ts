// Interface representing custom marker properties, extending google.maps.MarkerOptions
export interface VakufMarkerDetails {
  vakufName: string; // Name of the vakuf
  vakufType: string; // Type of the vakuf
  city: string; // City where the vakuf is located
  cadastralMunicipality: string; // Cadastral municipality information
  cadastralParcelNumber: string; // Cadastral parcel number
  realEstateNumber: string; // Real estate number
  areaSize: string; // Area size of the vakuf
  yearFounded: string; // Year the vakuf was founded
  streetName: string; // Name of the street where the vakuf is located
  vakufImage: string; // Image URL representing the vakuf
  position: google.maps.LatLngLiteral; // Position of the marker on the map
}