import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { collection, getDocs } from 'firebase/firestore';
import { sandzakCity } from '../database/sandzak-cities';
import { vakufObjecType } from '../database/vakuf-types';
import { CustomMarker } from '../interface/Marker';
import { render } from '../styles/marker/cluster-icon-style';
import { MarkerEventService } from './marker-event.service';

/**
 * Service responsible for managing markers on Google Maps.
 * Handles fetching markers from Firestore, caching, and creating markers on the map.
 */
@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  markers: CustomMarker[] = []; // Array to hold marker instances
  markerCluster?: MarkerClusterer; // MarkerCluster variable
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

  /**
   * Retrieves markers either from the cache or Firestore.
   * If cached markers are valid, returns them; otherwise, fetches markers from Firestore,
   * caches them, and returns them.
   * @returns A promise that resolves to an array of CustomMarker instances.
   */
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
   * Creates markers on the specified map based on marker data retrieved from Firestore.
   * Clears existing markers from the map, fetches marker data, creates markers, and initializes
   * the MarkerClusterer for clustering markers.
   * @param map - The Google Map instance.
   * @returns A promise that resolves when markers are successfully created on the map.
   */
  async createMarkers(map: google.maps.Map): Promise<void> {
    await this.clearMarkers();
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
        url: 'assets/images/marker_main.svg',
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

  /**
   * Clears existing markers from the map and marker array.
   * If a MarkerClusterer is present, also clears markers from the clusterer.
   * @returns A promise that resolves when markers are successfully cleared from the map.
   */
  private async clearMarkers(): Promise<void> {
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
    if (this.markerCluster) {
      this.markerCluster.clearMarkers();
    }
  }

  /**
   * Retrieves cached markers from local storage.
   * @returns An array of CustomMarker instances if markers are found in the cache, otherwise null.
   */
  private getCachedMarkers(): CustomMarker[] | null {
    const cachedMarkersJson = localStorage.getItem('markersCache');
    return cachedMarkersJson ? JSON.parse(cachedMarkersJson) : null;
  }

  /**
   * Caches markers in local storage along with an expiration timestamp.
   * @param markers - An array of CustomMarker instances to cache.
   */
  private cacheMarkers(markers: CustomMarker[]): void {
    localStorage.setItem('markersCache', JSON.stringify(markers));
    const expiration =
      new Date().getTime() + this.cacheDurationInMinutes * 60 * 1000;
    localStorage.setItem(this.cacheExpirationKey, expiration.toString());
  }

  /**
   * Checks if the cached markers are expired based on the cache expiration timestamp.
   * @returns True if the cached markers are expired, otherwise false.
   */

  private isCacheExpired(): boolean {
    const expiration = localStorage.getItem(this.cacheExpirationKey);
    if (!expiration) return true;
    const now = new Date().getTime();
    return now > parseInt(expiration);
  }
}
