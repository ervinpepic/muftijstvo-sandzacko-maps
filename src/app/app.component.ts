import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PolygonsBoundaries } from './polygons/map-polygons';
import { environment } from '../environments/environment.development';
import { Loader } from '@googlemaps/js-api-loader';
import { mapStyle } from './style/map/map-style';
import { MarkerService } from './services/marker.service';
import { NavbarComponent } from "./components/navbar/navbar.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [CommonModule, RouterOutlet, NavbarComponent]
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
      const googleApiAsyncLoader = new Loader({
        apiKey: environment.GOOGLEAPIKEY,
        version: 'weekly',
      });

      //initialize createMap() funciton with async closure
      await googleApiAsyncLoader.load();
      this.createMap();
    } catch (error) {
      // Handle the error appropriately (e.g., show a user-friendly message)
      console.error('Error loading Google Maps API:', error);
    }
  }

  //google maps creation
  createMap(): void {
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
