import { ElementRef, Injectable } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { PolygonsBoundaries } from '../polygons/map-polygons';
import { mapStyle } from '../styles/map/map-style';
import { getInitialZoomLevel } from '../utils/dynamic-zoom';
import { MarkerEventService } from './marker-event.service';
import { MarkerService } from './marker.service';
/**
 * Service responsible for creating instance of Google Maps.
 * Initializing maps
 */
@Injectable({
  providedIn: 'root',
})
export class MapService {
  private _map: google.maps.Map | undefined;
  private _map$ = new BehaviorSubject<google.maps.Map | undefined>(undefined);
  private polygons?: PolygonsBoundaries;

  readonly initialMapCenter = {
    lat: 42.99603931107363,
    lng: 19.863259815559704,
  };
  private initialMapZoom: number = getInitialZoomLevel();

  constructor(
    private markerService: MarkerService,
    private markerEventService: MarkerEventService
  ) {}

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

  /**
   * Initializes the map by loading the Google Maps API and creating the map instance.
   * @param mapContainer - The reference to the HTML element that will contain the map.
   */
  async initializeMap(mapContainer: ElementRef): Promise<void> {
    try {
      // Initialize Google Maps API loader
      const googleApiAsyncLoader = new Loader({
        apiKey: environment.googleApi.GOOGLEAPIKEY,
        version: 'weekly',
      });
      // Load Google Maps API asynchronously
      (await googleApiAsyncLoader.importLibrary(
        'maps'
      )) as google.maps.MapsLibrary;

      // Create the map after loading the API
      this.createMap(mapContainer);
    } catch (error) {
      // Handle the error appropriately (e.g., show a user-friendly message)
      console.error('Error loading Google Maps API:', error);
    }
  }

  /**
   * Creates the Google Map instance and initializes map-related functionalities.
   * @param mapContainer - The reference to the HTML element that will contain the map.
   */
  private createMap(mapContainer: ElementRef): void {
    // Initialize the Google Map
    this.map = new google.maps.Map(mapContainer.nativeElement, {
      center: this.initialMapCenter,
      zoom: this.initialMapZoom,
      styles: mapStyle,
    });

    // Create markers on the map
    this.markerService.createMarkers(this.map);

    // Draw polygons on the map
    this.polygons = new PolygonsBoundaries(this.map);
    this.polygons.drawPolygons();

    // Handle map click event
    this.markerEventService.handleMapClick(this.map);
  }
}
