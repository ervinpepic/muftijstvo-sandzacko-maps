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

import { zoomChange } from './zoom-change';

export class PolygonsBoundaries {
  noviPazarPolygon(map: google.maps.Map) {
    let noviPazarPolygon = new google.maps.Polygon({
      paths: noviPazarPolygonDelimiter,
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FC4445',
      fillOpacity: 0.43,
    });
    noviPazarPolygon.setMap(map);
    zoomChange(map, noviPazarPolygon);
  }

  tutinPolygon(map: google.maps.Map) {
    let tutinPolygon = new google.maps.Polygon({
      paths: tutinPolygonDelimiter,
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FC4445',
      fillOpacity: 0.43,
    });
    tutinPolygon.setMap(map);
    zoomChange(map, tutinPolygon);
  }

  sjenicaPolygon(map: google.maps.Map) {
    let sjenicaPolygon = new google.maps.Polygon({
      paths: sjenicaPolygonDelimiter,
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FC4445',
      fillOpacity: 0.43,
    });
    sjenicaPolygon.setMap(map);
    zoomChange(map, sjenicaPolygon);
  }

  novaVarosPolygon(map: google.maps.Map) {
    let novaVarosPolygon = new google.maps.Polygon({
      paths: novaVarosPolygonDelimiter,
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FC4445',
      fillOpacity: 0.43,
    });
    novaVarosPolygon.setMap(map);
    zoomChange(map, novaVarosPolygon);
  }

  prijepoljePolygon(map: google.maps.Map) {
    let prijepoljePolygon = new google.maps.Polygon({
      paths: prijepoljePolygonDelimiter,
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FC4445',
      fillOpacity: 0.43,
    });
    prijepoljePolygon.setMap(map);
    zoomChange(map, prijepoljePolygon);
  }

  pribojPolygon(map: google.maps.Map) {
    let pribojPolygon = new google.maps.Polygon({
      paths: pribojPolygonDelimiter,
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FC4445',
      fillOpacity: 0.43,
    });
    pribojPolygon.setMap(map);
    zoomChange(map, pribojPolygon);
  }

  rozajePolygon(map: google.maps.Map) {
    let rozajePolygon = new google.maps.Polygon({
      paths: rozajePolygonDelimiter,
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FC4445',
      fillOpacity: 0.43,
    });
    rozajePolygon.setMap(map);
    // zoomChange(map, rozajePolygon);
  }
  beranePolygon(map: google.maps.Map) {
    let beranePolygon = new google.maps.Polygon({
      paths: beranePolygonDelimiter,
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FC4445',
      fillOpacity: 0.43,
    });
    beranePolygon.setMap(map);
    zoomChange(map, beranePolygon);
  }
  andrijevicaPolygon(map: google.maps.Map) {
    let andrijevicaPolygon = new google.maps.Polygon({
      paths: andrijevicaPolygonDelimiter,
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FC4445',
      fillOpacity: 0.43,
    });
    andrijevicaPolygon.setMap(map);
    zoomChange(map, andrijevicaPolygon);
  }
  bijeloPoljePolygon(map: google.maps.Map) {
    let bijeloPoljePolygon = new google.maps.Polygon({
      paths: bijeloPoljePolygonDelimiter,
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FC4445',
      fillOpacity: 0.43,
    });
    bijeloPoljePolygon.setMap(map);
    zoomChange(map, bijeloPoljePolygon);
  }
  plavPolygon(map: google.maps.Map) {
    let plavPolygon = new google.maps.Polygon({
      paths: plavPolygonDelimiter,
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FC4445',
      fillOpacity: 0.43,
    });
    plavPolygon.setMap(map);
    zoomChange(map, plavPolygon);
  }
  pljevljaPolygon(map: google.maps.Map) {
    let pljevljaPolygon = new google.maps.Polygon({
      paths: pljevljaPolygonDelimiter,
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FC4445',
      fillOpacity: 0.43,
    });
    pljevljaPolygon.setMap(map);
    zoomChange(map, pljevljaPolygon);
  }
  gusinjePolygon(map: google.maps.Map) {
    let gusinjePolygon = new google.maps.Polygon({
      paths: gusinjePolygonDelimiter,
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FC4445',
      fillOpacity: 0.43,
    });
    gusinjePolygon.setMap(map);
    zoomChange(map, gusinjePolygon);
  }
  petnjicaPolygon(map: google.maps.Map) {
    let petnjicaPolygon = new google.maps.Polygon({
      paths: petnjicaPolygonDelimiter,
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FC4445',
      fillOpacity: 0.43,
    });
    petnjicaPolygon.setMap(map);
    zoomChange(map, petnjicaPolygon);
  }

  drawPolgygons(map: google.maps.Map) {
    this.noviPazarPolygon(map);
    this.tutinPolygon(map);
    this.sjenicaPolygon(map);
    this.novaVarosPolygon(map);
    this.prijepoljePolygon(map);
    this.pribojPolygon(map);
    this.rozajePolygon(map);
    this.beranePolygon(map);
    this.petnjicaPolygon(map);
    this.andrijevicaPolygon(map);
    this.bijeloPoljePolygon(map);
    this.plavPolygon(map);
    this.pljevljaPolygon(map);
    this.gusinjePolygon(map);
  }
}
