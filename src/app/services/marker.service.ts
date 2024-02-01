import { Injectable } from '@angular/core';
import { loadVakufData } from '../database/database-seed';
import { sandzakCity } from '../database/sandzak-cities';
import { vakufObjecType } from '../database/vakuf-types';
import { CustomMarker } from '../interface/Marker';
import { MarkerEventService } from './marker-event.service';
import { MarkerClusterer, Renderer } from '@googlemaps/markerclusterer';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  markers: CustomMarker[] = []; // Array to hold marker instances
  markerCluster?: MarkerClusterer;
  constructor(private markerEventService: MarkerEventService) {}

  /**
   * Returns data Vakuf and Cities and a marker objects.
   */
  getVakufObjectTypes(): string[] {
    return Object.values(vakufObjecType);
  }

  getVakufCities(): string[] {
    return Object.values(sandzakCity);
  }

  getMarkers(): CustomMarker[] {
    return loadVakufData();
  }
  /**
   * creates markers on the specified map.
   * @param map - The Google Map instance.
   */
  createMarkers(map: google.maps.Map): void {
    this.clearMarkers();
    try {
      const markerData = this.getMarkers();
      this.markers = markerData.map((markerData) =>
        this.createMarker(markerData, map));
        // intialize MarkerClusterer
        this.markerCluster = new MarkerClusterer({map: map, markers: this.markers})
    } catch (error) {
      console.error('Error creating markers', error);
    }
  }

  /**
   * Creates a marker based on the provided data and adds it to the map.
   * @param data - The marker data.
   * @param map - The Google Map instance.
   * @returns The created Google Maps Marker instance.
   */
  createMarker(data: CustomMarker, map: google.maps.Map): CustomMarker {
    const marker = new google.maps.Marker({
      ...data,
      position: new google.maps.LatLng(data.position),
      icon: {
        url: '../assets/images/marker_main.svg',
        scaledSize: new google.maps.Size(40, 40),
        labelOrigin: new google.maps.Point(20, -15),
      },
      draggable: false,
      optimized: false,
      animation: google.maps.Animation.DROP,
      map: map,
    });

    const customMarker = marker as CustomMarker;

    // Set up marker events and styling
    this.markerEventService.handleMarkerMouseHover(marker);
    this.markerEventService.handleMarkerInfoWindow(marker, data, map);
    return customMarker;
  }

  private clearMarkers(): void {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
    if (this.markerCluster) {
      this.markerCluster.clearMarkers();
    }
  }
}
