import { PolygonData } from '../interface/Polygon';
import { zoomChange } from '../utils/dynamic-zoom';
import { andrijevicaPolygonDelimiter } from './sandzak/andrijevica';
import { beranePolygonDelimiter } from './sandzak/berane';
import { bijeloPoljePolygonDelimiter } from './sandzak/bijeloPolje';
import { gusinjePolygonDelimiter } from './sandzak/gusinje';
import { novaVarosPolygonDelimiter } from './sandzak/novaVaros';
import { noviPazarPolygonDelimiter } from './sandzak/noviPazar';
import { petnjicaPolygonDelimiter } from './sandzak/petnjica';
import { plavPolygonDelimiter } from './sandzak/plav';
import { pljevljaPolygonDelimiter } from './sandzak/pljevlja';
import { pribojPolygonDelimiter } from './sandzak/priboj';
import { prijepoljePolygonDelimiter } from './sandzak/prijepolje';
import { rozajePolygonDelimiter } from './sandzak/rozaje';
import { sjenicaPolygonDelimiter } from './sandzak/sjenica';
import { tutinPolygonDelimiter } from './sandzak/tutin';

export class PolygonsBoundaries {
  private polygonData: PolygonData[] = [
    { delimiter: noviPazarPolygonDelimiter, name: 'noviPazarPolygon' },
    { delimiter: tutinPolygonDelimiter, name: 'tutinPolygon' },
    { delimiter: sjenicaPolygonDelimiter, name: 'sjenicaPolygon' },
    { delimiter: novaVarosPolygonDelimiter, name: 'novaVarosPolygon' },
    { delimiter: prijepoljePolygonDelimiter, name: 'prijepoljePolygon' },
    { delimiter: pribojPolygonDelimiter, name: 'pribojPolygon' },
    { delimiter: rozajePolygonDelimiter, name: 'rozajePolygon' },
    { delimiter: beranePolygonDelimiter, name: 'beranePolygon' },
    { delimiter: petnjicaPolygonDelimiter, name: 'petnjicaPolygon' },
    { delimiter: andrijevicaPolygonDelimiter, name: 'andrijevicaPolygon' },
    { delimiter: bijeloPoljePolygonDelimiter, name: 'bijeloPoljePolygon' },
    { delimiter: plavPolygonDelimiter, name: 'plavPolygon' },
    { delimiter: pljevljaPolygonDelimiter, name: 'pljevljaPolygon' },
    { delimiter: gusinjePolygonDelimiter, name: 'gusinjePolygon' },
  ];
  constructor(private map: google.maps.Map) {}

  /**
   * Creates a polygon object with the specified paths and styling.
   * @param paths - The array of LatLngLiteral objects defining the polygon's vertices.
   * @returns The created Google Maps Polygon instance.
   */
  private createPolygon(
    paths: google.maps.LatLngLiteral[]
  ): google.maps.Polygon {
    return new google.maps.Polygon({
      paths: paths,
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor:' #194248',//'#931A25',
      fillOpacity: 0.7,
    });
  }

  /**
   * Adds the specified polygon to the map.
   * @param polygon - The Google Maps Polygon instance to add to the map.
   */
  private addPolygonToMap(polygon: google.maps.Polygon) {
    polygon.setMap(this.map);
    zoomChange(this.map, polygon); // Assuming zoomChange function handles zooming appropriately
  }

  /**
   * Draws a polygon on the map based on the provided polygon data.
   * @param polygonData - The data defining the polygon's vertices and name.
   */
  private drawPolygon(polygonData: PolygonData) {
    const polygon = this.createPolygon(polygonData.delimiter);
    this.addPolygonToMap(polygon);
  }

  /**
   * Draws all polygons on the map.
   */
  drawPolygons() {
    this.polygonData.forEach((polygonData) => this.drawPolygon(polygonData));
  }
}
