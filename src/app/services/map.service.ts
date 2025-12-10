import { ElementRef, Injectable } from '@angular/core';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { PolygonsBoundaries } from '../polygons/map-polygons';
import { getInitialZoomLevel } from '../utils/dynamic-zoom';
import { MarkerService } from './marker.service';
/**
 * Service responsible for creating instance of Google Maps.
 * Initializing maps
 */
const MAP_CONFIG = {
  center: {
    lat: 42.99603931107363,
    lng: 19.863259815559704,
  },
  zoom: getInitialZoomLevel(),
  mapId: environment.googleApi.GOOGLEMAPS_ID,
};

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private _map: google.maps.Map | undefined;
  private _map$ = new BehaviorSubject<google.maps.Map | undefined>(undefined);

  private polygons?: PolygonsBoundaries;

  constructor(private markerService: MarkerService) {}

  // Returns the current Google Map instance.
  get map(): google.maps.Map | undefined {
    return this._map;
  }

  // Sets the Google Map instance and emits its value to observers.
  set map(value: google.maps.Map | undefined) {
    this._map = value;
    this._map$.next(value);
  }

  // Returns an observable that emits the current Google Map instance.
  get map$(): Observable<google.maps.Map | undefined> {
    return this._map$.asObservable();
  }

  // Initialize googleMapsAPI
  private async loadGoogleMapsAPI(): Promise<void> {
    setOptions({key: environment.googleApi.GOOGLEAPIKEY});
    await importLibrary('maps');
  }

  /**
   * Initializes the map by loading the Google Maps API and creating the map instance.
   * @param mapContainer - The reference to the HTML element that will contain the map.
   */
  async initializeMap(mapContainer: ElementRef): Promise<void> {
    try {
      await this.loadGoogleMapsAPI();
      this.createMap(mapContainer);
      if (this.map) {
        this.markerService.map = this.map;
        return;
      }
    } catch (error) {
      console.error('Error while loading Google Maps API:', error);
    }
  }

  /**
   * Creates the Google Map instance and initializes map-related functionalities.
   * @param mapContainer - The reference to the HTML element that will contain the map.
   */
  private createMap(mapContainer: ElementRef): void {
    this.map = new google.maps.Map(mapContainer.nativeElement, MAP_CONFIG);

    this.initializeMarkers();
    this.initializePolygons();
  }

  private initializeMarkers(): void {
    if (this.map) {
      this.markerService.createMarkers(this.map);
    }
  }

  private initializePolygons(): void {
    if (this.map) {
      this.polygons = new PolygonsBoundaries(this.map);
      this.polygons.drawPolygons();
    }
  }

  addMarker(marker: google.maps.marker.AdvancedMarkerElement): void {
    marker.map = this.map;
  }

  removeMarker(marker: google.maps.marker.AdvancedMarkerElement): void {
    marker.map = null;
  }
}
