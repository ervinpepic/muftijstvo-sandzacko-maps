import { Injectable } from '@angular/core';
import { Observable, lastValueFrom, of } from 'rxjs';

import { CustomMarker } from '../interface/Marker';
import { VakufData } from '../database/database-seed';

import { MarkerEvent } from '../events/marker-events';
import { MarkerStyle } from '../styles/marker/marker-style';
import { vakufObjecType } from '../database/vakuf-types';
import { sandzakCity } from '../database/sandzak-cities';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  markers: any[] = []; // Array to hold marker instances
  vakufCities: string[] = []; // Array to hold vakuf cities
  vakufTypes: string[] = []; // Array to hold vakuf types

  // Instances for handling marker events and styling
  markerEvent = new MarkerEvent();
  markerStyle = new MarkerStyle();

  constructor() {}

  /**
   * Returns an observable of Vakuf and Cities and a marker objects.
   */
  getVakufObjectTypes(): Observable<string[]> {
    return of(Object.values(vakufObjecType));
  }

  getVakufCities(): Observable<string[]> {
    return of(Object.values(sandzakCity));
  }

  getMarkers(): Observable<CustomMarker[]> {
    return of(VakufData);
  }

  /**
   * Asynchronously creates markers on the specified map.
   * @param map - The Google Map instance.
   */
  async createMarkers(map: google.maps.Map): Promise<void> {
    try {
      const markerData = await lastValueFrom(this.getMarkers());
      this.markers =
        markerData?.map((data) => this.createMarker(data, map)) || [];
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
  createMarker(data: any, map: google.maps.Map): google.maps.Marker {
    const marker = new google.maps.Marker({
      ...data,
      position: new google.maps.LatLng(data.position),
      icon: this.markerStyle.createDefaultMarkerIcon(),
      draggable: false,
      optimized: false,
      animation: google.maps.Animation.DROP,
    });

    // Set up marker events and styling
    this.markerEvent.handleMarkerInfoWindow(marker, data, map);
    this.markerEvent.handleMarkerMouseOver(marker);
    this.markerEvent.handleMarkerMouseOut(marker);

    marker.setMap(map); // Set the map
    return marker;
  }
}
