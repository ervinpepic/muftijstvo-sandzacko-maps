import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { SandzakCity } from '../database/sandzak-cities';
import { VakufObjectType } from '../database/vakuf-types';
import { Marker } from '../interface/Marker';
import {
  markerClickListener,
  markerHoverEffect,
} from '../styles/marker/marker-events';
import { StorageUtil } from '../utils/local-storage-util';
/**
 * Service responsible for creating markers and clusters on Google Maps.
 * Initialize markers on the map an clusters them when there a collision
 */
@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  public map?: google.maps.Map;
  public markers: google.maps.marker.AdvancedMarkerElement[] = [];
  // Maps markers to their custom data
  public markerDataMap = new Map<google.maps.marker.AdvancedMarkerElement, Marker >(); 
  private _markersNumber: number = 0;

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
    return StorageUtil.getFromLocalStorage<Marker[]>('cachedMarkerData');
  }

  /**
   * Fetches marker data, preferring cached data when available.
   * @returns {Promise<Marker[]>} Promise resolving to an array of custom marker data.
   */
  async getMarkers(): Promise<Marker[]> {
    const cachedData = this.getMarkerDataFromLocalStorage();
    if (cachedData) {
      this._markersNumber = cachedData.length;
      return cachedData;
    }

    try {
      const markersCollection = collection(this.firestore, 'markers');
      const querySnapshot = await getDocs(markersCollection);
      const fetchedMarkersData: Marker[] = querySnapshot.docs.map(
        (doc) => doc.data() as Marker
      );

      this.saveMarkerDataToLocalStorage(fetchedMarkersData);
      this._markersNumber = fetchedMarkersData.length;
      return fetchedMarkersData;
    } catch (error) {
      console.error('Error while fetching markers => ', error);
      this._markersNumber = 0;

      return [];
    }
  }

  /**
   * Creates markers on the map using fetched marker data.
   * @param {google.maps.Map} map - The Google Maps instance on which to create markers.
   * @returns {Promise<void>} Promise that resolves when markers are created.
   */
  async createMarkers(map: google.maps.Map): Promise<void> {
    this.markers.forEach((marker) => (marker.map = null));
    this.markers = [];
    this.markerDataMap.clear();

    try {
      const markerAdditionalData = await this.getMarkers();

      for (const markerData of markerAdditionalData) {
        const marker = await this.createMarker(markerData, map);
        this.markers.push(marker);
        this.markerDataMap.set(marker, markerData);
      }
    } catch (error) {
      console.warn('Error while creating markers:', error);
    }
  }

  /**
   * Creates a single marker and associates it with custom data.
   * @param {Marker} markerData - Custom data for the marker.
   * @param {google.maps.Map} map - The Google Maps instance to place the marker on.
   * @returns {google.maps.advancedMarkerElement} The created advanced marker instance.
   */
  private async createMarker(
    markerData: Marker,
    map: google.maps.Map
  ): Promise<google.maps.marker.AdvancedMarkerElement> {
    const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker')) as google.maps.MarkerLibrary;
  
    const svgImageElement = document.createElement('img');
    svgImageElement.src = '../assets/marker_main.svg';
    svgImageElement.width = 40;
    svgImageElement.height = 40;
    svgImageElement.style.transform = 'scale(1.3)';
    svgImageElement.title = markerData.vakufName;

    const marker = new AdvancedMarkerElement({
      position: markerData.position,
      map: map,
      content: svgImageElement,
      collisionBehavior: google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY,
      gmpDraggable: false,
      gmpClickable: true,
    });

    markerHoverEffect(marker, svgImageElement);
    markerClickListener(marker, map, markerData);

    return marker;
  }
}
