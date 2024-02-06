import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { collection, getDocs } from 'firebase/firestore';
import { sandzakCity } from '../database/sandzak-cities';
import { vakufObjecType } from '../database/vakuf-types';
import { CustomMarker } from '../interface/Marker';
import { render } from '../styles/marker/cluster-icon-style';
import { MarkerEventService } from './marker-event.service';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  markers: CustomMarker[] = []; // Array to hold marker instances
  markerCluster?: MarkerClusterer;
  private cacheExpirationKey = 'markersCacheExpiration';
  private cacheDurationInMinutes = 6 * 30 * 24 * 60; // Cache duration in minutes (1 day)

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
    // Check if cached markers are still valid
    const cachedMarkers = this.getCachedMarkers();
    if (cachedMarkers && !this.isCacheExpired()) {
      return cachedMarkers;
    }
    try {
      const markersCollection = collection(this.firestore, 'markers');
      const querySnapshot = await getDocs(markersCollection);
      querySnapshot.forEach((doc) => {
        const markerData = doc.data();
        this.markers.push(markerData as CustomMarker);
      });

      // Cache the fetcher markers
      this.cacheMarkers(this.markers);
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

  private getCachedMarkers(): CustomMarker[] | null {
    const cachedMarkersJson = localStorage.getItem('markersCache');
    return cachedMarkersJson ? JSON.parse(cachedMarkersJson) : null;
  }

  private cacheMarkers(markers: CustomMarker[]): void {
    localStorage.setItem('markersCache', JSON.stringify(markers));
    const expiration =
      new Date().getTime() + this.cacheDurationInMinutes * 60 * 1000;
    localStorage.setItem(this.cacheExpirationKey, expiration.toString());
  }

  private isCacheExpired(): boolean {
    const expiration = localStorage.getItem(this.cacheExpirationKey);
    if (!expiration) return true;
    const now = new Date().getTime();
    return now > parseInt(expiration);
  }
}
