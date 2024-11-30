// Interface to define structure for the Polygon on the Google Map
export interface MapPolygonKML {
  delimiter: google.maps.LatLngLiteral[];
  name: string;
}
