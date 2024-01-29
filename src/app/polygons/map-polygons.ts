import { PolygonData } from '../interface/Polygon';
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
import { zoomChange } from '../utils/dynamic-zoom';

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

  private createPolygon(
    paths: google.maps.LatLngLiteral[]
  ): google.maps.Polygon {
    return new google.maps.Polygon({
      paths: paths,
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FC4445',
      fillOpacity: 0.43,
    });
  }

  private addPolygonToMap(polygon: google.maps.Polygon) {
    polygon.setMap(this.map);
    zoomChange(this.map, polygon);
  }

  private drawPolygon(polygonData: PolygonData) {
    const polygon = this.createPolygon(polygonData.delimiter);
    this.addPolygonToMap(polygon);
  }

  drawPolgygons() {
    this.polygonData.map((polygonData) => this.drawPolygon(polygonData));
  }
}
