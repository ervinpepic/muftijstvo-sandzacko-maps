export interface CustomMarker extends google.maps.MarkerOptions {
  vakufName: string;
  vakufType: string;
  city: string;
  cadastralMunicipality: string;
  cadastralParcelNumber: string;
  realEstateNumber: string;
  areaSize: string;
  yearFounded: string;
  streetName: string;
  vakufImage: string;
  position: google.maps.LatLngLiteral;
}
