import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from '../environments/environment.development';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PolygonsBoundaries } from './polygons/map-polygons';
import { MarkerService } from './services/marker.service';
import { mapStyle } from './styles/map/map-style';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule, RouterOutlet, NavbarComponent],
})
export class AppComponent {
  title = 'muftijstvo-sandzacko-maps';
  @ViewChild('mapContainer', { static: true }) mapContainer?: ElementRef;

  map?: google.maps.Map; //google maps declaration
  polygons = new PolygonsBoundaries(); //map polygon boundaries for Sandzak

  // Constants for initial map settings
  readonly initialMapCenter = {
    lat: 42.99603931107363,
    lng: 19.863259815559704,
  };
  readonly initialMapZoom = 9;

  constructor(private markerService: MarkerService) {}

  //mandatory method for OnInit decorator
  async ngOnInit(): Promise<void> {
    try {
      // Initialize Google Maps API loader
      const googleApiAsyncLoader = new Loader({
        apiKey: environment.GOOGLEAPIKEY,
        version: 'weekly',
      });

      // Load Google Maps API asynchronously
      await googleApiAsyncLoader.load();
      // Create the map after loading the API
      this.createMap();
    } catch (error) {
      // Handle the error appropriately (e.g., show a user-friendly message)
      console.error('Error loading Google Maps API:', error);
    }
  }

  // Google Maps creation
  createMap(): void {
    // Initialize the Google Map
    this.map = new google.maps.Map(this.mapContainer!.nativeElement, {
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
