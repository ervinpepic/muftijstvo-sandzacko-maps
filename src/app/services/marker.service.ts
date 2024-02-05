import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { collection, getDocs } from 'firebase/firestore';
import { sandzakCity } from '../database/sandzak-cities';
import { vakufObjecType } from '../database/vakuf-types';
import { CustomMarker } from '../interface/Marker';
import { render } from '../styles/marker/cluster-icon-style';
import { MarkerEventService } from './marker-event.service';

// async addMarker(): Promise<void> {
//   try {
//     const markersColletcion = collection(this.firestore, 'markers');
//     const markerData = this.getMarkers();
//     for (const marker of markerData) {
//       await addDoc(markersColletcion, marker);
//     }
//     console.log('Marker data added to Firestore');
//   } catch (error) {
//     console.error('Error adding marker data to Firestore:', error);
//   }
// }
/**
 * Returns data Vakuf and Cities and a marker objects.
 */

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  markers: CustomMarker[] = []; // Array to hold marker instances
  markerCluster?: MarkerClusterer;
  constructor(
    private markerEventService: MarkerEventService,
    private firestore: Firestore
  ) {}

  getVakufObjectTypes(): string[] {
    return Object.values(vakufObjecType);
  }

  getVakufCities(): string[] {
    return Object.values(sandzakCity);
  }

  async getMarkers(): Promise<CustomMarker[]> {
    try {
      const markersCollection = collection(this.firestore, 'markers');
      const querySnapshot = await getDocs(markersCollection);
      querySnapshot.forEach((doc) => {
        const mrkData = doc.data();
        this.markers.push(mrkData as CustomMarker);
      });
      return this.markers;
    } catch (error) {
      console.log('Error while fetching markers => ', error);
      return [];
    }
  }
  /**
   * creates markers on the specified map.
   * @param map - The Google Map instance.
   */
  async createMarkers(map: google.maps.Map): Promise<void> {
    this.clearMarkers();
    try {
      const markerData = await this.getMarkers();
      this.markers = markerData.map((markerData) =>
        this.createMarker(markerData, map)
      );

      // intialize MarkerClusterer
      this.markerCluster = new MarkerClusterer({
        map: map,
        markers: this.markers,
        renderer: render,
      });
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
        scaledSize: new google.maps.Size(60, 40),
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
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
    if (this.markerCluster) {
      this.markerCluster.clearMarkers();
    }
  }
}
