import { Injectable } from '@angular/core';
import { Observable, lastValueFrom, of } from 'rxjs';

import { CustomMarker } from '../interface/Marker';
import { VakufData } from '../database/database-seed';
import { MarkerStyle } from '../styles/marker/marker-style';
import { vakufObjecType } from '../database/vakuf-types';
import { sandzakCity } from '../database/sandzak-cities';
import { MarkerEventService } from './marker-event.service';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  markers: CustomMarker[] = []; // Array to hold marker instances

  markerStyle = new MarkerStyle(); // Instances for handling marker events and styling

  constructor(private markerEventService: MarkerEventService) {}

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
  createMarker(data: any, map: google.maps.Map): CustomMarker {
    const marker = new google.maps.Marker({
      ...data,
      position: new google.maps.LatLng(data.position),
      icon: this.markerStyle.createDefaultMarkerIcon(),
      draggable: false,
      optimized: false,
      animation: google.maps.Animation.DROP,
      map: map,
    });
    const customMarker = marker as CustomMarker;

    // Set up marker events and styling
    this.markerEventService.handleMarkerInfoWindow(marker, data, map);
    this.markerEventService.handleMarkerMouseOver(marker);
    this.markerEventService.handleMarkerMouseOut(marker);

    return customMarker;
  }
}
