import { ElementRef, Injectable } from '@angular/core';
import { MarkerService } from './marker.service';
import { environment } from '../../environments/environment.development';
import { Loader } from '@googlemaps/js-api-loader';
import { getInitialZoomLevel } from '../utils/dynamic-zoom';
import { PolygonsBoundaries } from '../polygons/map-polygons';
import { mapStyle } from '../styles/map/map-style';
import { MarkerEventService } from './marker-event.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private _map: google.maps.Map | undefined;
  private _map$ = new BehaviorSubject<google.maps.Map | undefined>(undefined);
  polygons = new PolygonsBoundaries(); //map polygon boundaries for Sandzak
  readonly initialMapCenter = {
    lat: 42.99603931107363,
    lng: 19.863259815559704,
  };
  initialMapZoom: number = getInitialZoomLevel();

  constructor(
    private markerService: MarkerService,
    private markerEventService: MarkerEventService
  ) {}

  get map(): google.maps.Map | undefined {
    return this._map;
  }

  set map(value: google.maps.Map | undefined) {
    this._map = value;
    this._map$.next(value);
  }

  get map$(): Observable<google.maps.Map | undefined> {
    return this._map$.asObservable();
  }
  async initializeMap(mapContainer: ElementRef): Promise<void> {
    try {
      // Initialize Google Maps API loader
      const googleApiAsyncLoader = new Loader({
        apiKey: environment.GOOGLEAPIKEY,
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

  private createMap(mapContainer: ElementRef): void {
    // Initialize the Google Map
    this.map = new google.maps.Map(mapContainer.nativeElement, {
      center: this.initialMapCenter,
      zoom: this.initialMapZoom,
      styles: mapStyle,
    });

    // Method call to create markers on the map
    this.markerService.createMarkers(this.map);
    // Method call to draw polygons on the map
    this.polygons.drawPolgygons(this.map);
    this.markerEventService.handleMapClick(this.map);
  }
}
