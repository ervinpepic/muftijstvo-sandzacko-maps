import { ElementRef, Injectable } from '@angular/core';
import { MarkerService } from './marker.service';
import { environment } from '../../environments/environment.development';
import { Loader } from '@googlemaps/js-api-loader';
import { getInitialZoomLevel } from '../utils/dynamic-zoom';
import { PolygonsBoundaries } from '../polygons/map-polygons';
import { mapStyle } from '../styles/map/map-style';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  map?: google.maps.Map;
  polygons = new PolygonsBoundaries(); //map polygon boundaries for Sandzak
  readonly initialMapCenter = {
    lat: 42.99603931107363,
    lng: 19.863259815559704,
  };
  initialMapZoom: number = 0;
  constructor(private markerService: MarkerService) {
    this.initialMapZoom = getInitialZoomLevel();
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
  }
}
