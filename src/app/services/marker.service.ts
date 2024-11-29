import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { collection, getDocs } from 'firebase/firestore';
import { SandzakCity } from '../database/sandzak-cities';
import { VakufObjectType } from '../database/vakuf-types';
import { Marker } from '../interface/Marker';
import { infoWindowStyle } from '../styles/marker/info-window-style';
import { StorageUtil } from '../utils/local-storage-util';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {

  map?: google.maps.Map;
  markers: google.maps.marker.AdvancedMarkerElement[] = []; // Holds instances of map markers
  markerCluster?: MarkerClusterer; // Optional variable for marker clustering functionality
  markerDataMap = new Map<google.maps.marker.AdvancedMarkerElement, Marker>(); // Maps markers to their custom data
  infoWindow: google.maps.InfoWindow | undefined;

  private _markersNumber: number = 0; //this is for collection marker numbers on front page

  constructor(private firestore: Firestore) {}

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
   * @param {Marker[]} markerData - Array of custom marker data to be saved.
   */
  private saveMarkerDataToLocalStorage(markerData: Marker[]): void {
    StorageUtil.saveToLocalStorage('cachedMarkerData', markerData);
  }

  /**
   * Retrieves marker data from local storage if not older than one month.
   * @returns {Marker[] | null} Array of custom marker data or null if not found or expired.
   */
  private getMarkerDataFromLocalStorage(): Marker[] | null {
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
   * @returns {Promise<Marker[]>} Promise resolving to an array of custom marker data.
   */
  async getMarkers(): Promise<Marker[]> {
    const cachedData = this.getMarkerDataFromLocalStorage();
    if (cachedData) {
      // console.log('Calling filter service');
      this._markersNumber = cachedData.length; // Update marker count
      return cachedData;
    }
    try {
      const markersCollection = collection(this.firestore, 'markers');
      const querySnapshot = await getDocs(markersCollection);
      const fetchedMarkersData: Marker[] = querySnapshot.docs.map(
        (doc) => doc.data() as Marker
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
      // Clear existing markers first
      this.clearMarkers();

      // Get custom marker data asynchronously
      const markerAdditionalData = await this.getMarkers();
      this.markers = [];
      this.markerDataMap.clear();

      // Create and add markers
      for (const markerData of markerAdditionalData) {
        const marker = await this.createMarker(markerData, map); // Ensure the marker is created asynchronously
        this.markers.push(marker);
        this.markerDataMap.set(marker, markerData);
      }

      // Clear the marker cluster and recreate it with the new markers
      if (this.markerCluster) {
        this.markerCluster.clearMarkers();
      }

      // Create a new marker cluster
      this.markerCluster = new MarkerClusterer({
        map: map,
        markers: this.markers,
      });
    } catch (error) {
      console.error('Error creating markers:', error);
      // Handle error appropriately (e.g., show user notification)
    }
  }

  /**
   * Creates a single marker and associates it with custom data.
   * @param {Marker} markerData - Custom data for the marker.
   * @param {google.maps.Map} map - The Google Maps instance to place the marker on.
   * @returns {google.maps.advancedMarkerElement} The created advanced marker instance.
   */
  async createMarker(
    markerData: Marker,
    map: google.maps.Map
  ): Promise<google.maps.marker.AdvancedMarkerElement> {

    // Dynamically import the marker library
    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      'marker'
    )) as google.maps.MarkerLibrary;

    const { InfoWindow } = (await google.maps.importLibrary(
      'maps'
    )) as google.maps.MapsLibrary;

    // Create the AdvancedMarkerElement
    const marker = new AdvancedMarkerElement({
      position: markerData.position,
      map: map,
      gmpDraggable: false,
      gmpClickable: true,
    });
    this.infoWindow = new InfoWindow({
      content: infoWindowStyle(markerData),
    });
    marker.addListener('click', () => {
      this.infoWindow?.open({
        anchor: marker,
        map: this.map,
      });
    });
    // Store the marker and its data
    this.markerDataMap.set(marker, markerData);

    return marker;
  }

  /**
   * Clears all markers from the map.
   * @returns {Promise<void>} Promise that resolves when all markers are cleared.
   */
  private clearMarkers(): void {
    if (this.markerCluster) {
      this.markerCluster.clearMarkers();
    }
    this.markers = [];
  }
}
