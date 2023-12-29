import { Injectable } from '@angular/core';
import { Observable, lastValueFrom, of } from 'rxjs';

import { CustomMarker } from '../Marker';
import { VakufData } from '../database/database-seed';

import { MarkerEvent } from '../events/marker-events';
import { MarkerStyle } from '../styles/marker/marker-style';
import { vakufObjecType } from '../database/vakuf-types';
import { sandzakCity } from '../database/sandzak-cities';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  markers: any[] = [];
  vakufCities: string[] = [];
  vakufTypes: string[] = [];

  // Marker event and styling instances
  markerEvent = new MarkerEvent();
  markerStyle = new MarkerStyle();

  constructor() {}

  getVakufObjectTypes(): Observable<string[]> {
    return of(Object.values(vakufObjecType));
  }

  getVakufCities(): Observable<string[]> {
    return of(Object.values(sandzakCity));
  }

  getMarkers(): Observable<CustomMarker[]> {
    return of(VakufData);
  }

  async createMarkers(map: google.maps.Map): Promise<void> {
    try {
      const markerData = await lastValueFrom(this.getMarkers());
      this.markers =
        markerData?.map((data) => this.createMarker(data, map)) || [];
    } catch (error) {
      console.error('Error creating markers', error);
    }
  }

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

  updateMarkersVisibility(filteredMarkers: any[]): void {
    this.markers.forEach((marker) => {
      marker.setVisible(filteredMarkers.includes(marker));
    });
  }
}
