import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { collection, getDocs } from 'firebase/firestore';
import { SandzakCity } from '../database/sandzak-cities';
import { VakufObjectType } from '../database/vakuf-types';
import { VakufMarkerDetails } from '../interface/Marker';
import { render } from '../styles/marker/cluster-icon-style';
import { MarkerEventService } from './marker-event.service';
import { StorageUtil } from '../utils/local-storage-util';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  markers: google.maps.Marker[] = []; // Holds instances of map markers
  markerCluster?: MarkerClusterer; // Optional variable for marker clustering functionality
  markerDataMap = new Map<google.maps.Marker, VakufMarkerDetails>(); // Maps markers to their custom data
  private _markersNumber: number = 0; // Add this property

  constructor(
    private markerEventService: MarkerEventService,
    private firestore: Firestore
  ) {}
  // Getter to access the number of markers
  get markersNumber(): number {
    return this._markersNumber;
  }
  /**
   * Returns an array of vakuf object types.
   * @returns {string[]} Array of vakuf object types as strings.
   */
  getVakufObjectTypes(): string[] {
    return Object.values(VakufObjectType);
  }

  /**
   * Returns an array of cities in Sandzak.
   * @returns {string[]} Array of city names as strings.
   */
  getVakufCities(): string[] {
    return Object.values(SandzakCity);
  }

  /**
   * Saves marker data array to local storage with a timestamp.
   * @param {VakufMarkerDetails[]} markerData - Array of custom marker data to be saved.
   */
  private saveMarkerDataToLocalStorage(markerData: VakufMarkerDetails[]): void {
    StorageUtil.saveToLocalStorage('cachedMarkerData', markerData);
  }

  /**
   * Retrieves marker data from local storage if not older than one month.
   * @returns {VakufMarkerDetails[] | null} Array of custom marker data or null if not found or expired.
   */
  private getMarkerDataFromLocalStorage(): VakufMarkerDetails[] | null {
    const item = StorageUtil.getFromLocalStorage('cachedMarkerData');
    if (!item) return null;
  
    if (!StorageUtil.isCacheValid(item.timestamp)) {
      StorageUtil.removeFromLocalStorage('cachedMarkerData');
      return null;
    }
  
    return item.data;
  }
  

  /**
   * Fetches marker data, preferring cached data when available.
   * @returns {Promise<VakufMarkerDetails[]>} Promise resolving to an array of custom marker data.
   */
  async getMarkers(): Promise<VakufMarkerDetails[]> {
    const cachedData = this.getMarkerDataFromLocalStorage();
    if (cachedData) {
      console.log("Calling filter service")
      this._markersNumber = cachedData.length; // Update marker count
      return cachedData;
    }
    try {
      const markersCollection = collection(this.firestore, 'markers');
      const querySnapshot = await getDocs(markersCollection);
      const fetchedMarkersData: VakufMarkerDetails[] = querySnapshot.docs.map(
        (doc) => doc.data() as VakufMarkerDetails
      );

      this.saveMarkerDataToLocalStorage(fetchedMarkersData);
      this._markersNumber = fetchedMarkersData.length; // Update marker count
      return fetchedMarkersData;
    } catch (error) {
      console.error('Error while fetching markers => ', error);
      this._markersNumber = 0; // Reset marker count on error
      return [];
    }
  }

  /**
   * Creates markers on the map using fetched marker data.
   * @param {google.maps.Map} map - The Google Maps instance on which to create markers.
   * @returns {Promise<void>} Promise that resolves when markers are created.
   */
  async createMarkers(map: google.maps.Map): Promise<void> {
    try {
      await this.clearMarkers();
      const customMarkerData = await this.getMarkers();
      this.markers = [];
      this.markerDataMap.clear();
  
      customMarkerData.forEach((data) => {
        const marker = this.createMarker(data, map);
        this.markers.push(marker);
        this.markerDataMap.set(marker, data);
      });
  
      if (this.markerCluster) {
        this.markerCluster.clearMarkers();
      }
      this.markerCluster = new MarkerClusterer({
        map: map,
        markers: this.markers,
        renderer: render,
      });
    } catch (error) {
      console.error('Error creating markers:', error);
      // Handle error appropriately (e.g., show user notification)
    }
  }
  

  /**
   * Creates a single marker and associates it with custom data.
   * @param {VakufMarkerDetails} data - Custom data for the marker.
   * @param {google.maps.Map} map - The Google Maps instance to place the marker on.
   * @returns {google.maps.Marker} The created marker instance.
   */
  createMarker(
    data: VakufMarkerDetails,
    map: google.maps.Map
  ): google.maps.Marker {
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

    this.markerDataMap.set(marker, data);

    this.markerEventService.handleMarkerMouseHover(marker);
    this.markerEventService.handleMarkerInfoWindow(marker, data, map);
    return marker;
  }

  /**
   * Clears all markers from the map.
   * @returns {Promise<void>} Promise that resolves when all markers are cleared.
   */
  private async clearMarkers(): Promise<void> {
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
    if (this.markerCluster) {
      this.markerCluster.clearMarkers();
    }
  }
  
}
