import { Injectable } from '@angular/core';
import { debounceTime, take, tap } from 'rxjs/operators';
import { Marker } from '../interface/Marker';
import { normalizeString } from '../utils/input-validators';
import { MapService } from './map.service';
import { MarkerService } from './marker.service';
import { getInitialZoomLevel } from '../utils/dynamic-zoom';

// Map center when app initialy load
const CENTER = {
  lat: 42.99603931107363,
  lng: 19.863259815559704,
};

/**
 * Service responsible for filtering either cached or fetched markers on Google Maps
 * Returns the visible or invisible state of the markers based on certain criteria
 */
@Injectable({
  providedIn: 'root',
})
export class FilterService {
  constructor(
    private mapService: MapService,
    private markerService: MarkerService
  ) {}

  protected map?: google.maps.Map; // Foogle map instance
  private _searchQuery: string = ''; // Search query string
  private _selectedCity: string | null = null; // Selected city filter
  private _selectedVakufType: string | null = null; // Selected vakuf type filter
  private _selectedVakufName: string | null = null; // Selected vakuf name filter
  private _filteredMarkers: google.maps.marker.AdvancedMarkerElement[] = [];

  // Getter methods to expose values In FilterService

  public get filteredMarkers(): google.maps.marker.AdvancedMarkerElement[] {
    return this._filteredMarkers;
  }

  private setFilteredMarkers(
    markers: google.maps.marker.AdvancedMarkerElement[]
  ): void {
    this._filteredMarkers = markers;
  }
  get searchQuery(): string {
    return this._searchQuery;
  }

  get selectedCity(): string | null {
    return this._selectedCity;
  }

  get selectedVakufType(): string | null {
    return this._selectedVakufType;
  }

  get selectedVakufName(): string | null {
    return this._selectedVakufName;
  }

  // Setter methods to update values
  set searchQuery(value: string) {
    this._searchQuery = value;
  }

  set selectedCity(value: string | null) {
    this._selectedCity = value;
  }

  set selectedVakufType(value: string | null) {
    this._selectedVakufType = value;
  }

  set selectedVakufName(value: string | null) {
    this._selectedVakufName = value;
  }

  /**
   * Filters an array of markers based on the specified criteria and updates their visibility.
   * @param markers - An array of markers to filter.
   * @returns An array of CustomMarker objects representing the visible markers.
   */
  filterMarkers(markers: google.maps.marker.AdvancedMarkerElement[]): google.maps.marker.AdvancedMarkerElement[] {
    const normalizedSearchTerm = this.normalizeSearchTerm(this.searchQuery);
    const bounds = new google.maps.LatLngBounds();
    const visibleMarkers: google.maps.marker.AdvancedMarkerElement[] = [];

    markers.forEach((marker) => {
      const customData = this.markerService.markerDataMap.get(marker);
      if (customData && this.isVisibleMarker(customData, normalizedSearchTerm)) {
        bounds.extend(marker.position as google.maps.LatLng | google.maps.LatLngLiteral);
        if (!marker.map) {
          marker.map = this.map;
        }
        visibleMarkers.push(marker);
      } else {
        if (marker.map) {
          marker.map = null;
        }
      }
    });
    if (visibleMarkers.length > 0) {
      this.fitBoundsAfterDelay(bounds);
    }
    this.setFilteredMarkers(visibleMarkers);

    return visibleMarkers;
  }

  public hasActiveFilters(): boolean {
    return (
      this.selectedVakufType !== '' || 
      this.selectedCity !== '' || 
      this.selectedVakufName !== '' || 
      this.searchQuery !== ''
    );
  }

  /**
   * Checks if a marker is visible based on the filter criteria.
   * @param data - The marker to check visibility for.
   * @param searchTerm - The normalized search term.
   * @returns A boolean indicating if the marker is visible.
   */
  private isVisibleMarker(data: Marker, searchTerm: string): boolean {
    return (
      this.matchesCity(data) &&
      this.matchesVakufType(data) &&
      this.matchesVakufName(data) &&
      this.matchesSearchTerm(data, searchTerm)
    );
  }

  private matchesCity(data: Marker): boolean {
    return !this.selectedCity || data.city === this.selectedCity;
  }

  private matchesVakufType(data: Marker): boolean {
    return !this.selectedVakufType || data.vakufType === this.selectedVakufType;
  }

  private matchesVakufName(data: Marker): boolean {
    const normalizedVakufName = this.normalizeSearchTerm(data.vakufName);
    return (
      !this.selectedVakufName ||
      normalizedVakufName === this.normalizeSearchTerm(this.selectedVakufName)
    );
  }

  private matchesSearchTerm(data: Marker, searchTerm: string): boolean {
    const normalizedVakufName = this.normalizeSearchTerm(data.vakufName);
    return (
      !searchTerm ||
      normalizedVakufName.includes(searchTerm) ||
      data.cadastralParcelNumber.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Normalizes the search term.
   * @param term - The search term to normalize.
   * @returns The normalized search term.
   */
  private normalizeSearchTerm(term: string | null): string {
    return term ? normalizeString(term.toLowerCase()) : '';
  }

  /**
   * Fits map bounds to visible markers after a delay.
   * @param bounds - The bounds to fit.
   */
  private fitBoundsAfterDelay(bounds: google.maps.LatLngBounds): void {
    this.mapService.map$
      .pipe(
        debounceTime(300),
        take(1),
        tap(() => this.mapService.map?.fitBounds(bounds))
      )
      .subscribe({
        error: (err) => console.error('Error adjusting map bounds:', err),
      });
  }

  /**
   * Resets the visibility of the markers to the initial state.
   *
   * @param markers An array of markers to be reset. If the array is empty or null, the method exits early.
   *
   * Functionality:
   * 1. Clears and updates the markers.
   * 2. Applies a predefined zoom level and map center after a short delay.
   * 5. Updates the internal filtered markers list.
   */
  resetMarkers(markers: google.maps.marker.AdvancedMarkerElement[]): void {
    if (!this.hasActiveFilters()) {
      markers.forEach((marker) => {
        if (!marker.map) {
          marker.map = this.mapService.map;
        }
      });
  
      setTimeout(() => {
        const initialZoomLevel = getInitialZoomLevel();
        this.mapService.map!.setZoom(initialZoomLevel);
        this.mapService.map!.setCenter(CENTER);
      }, 300);
  
      this.setFilteredMarkers(markers);
    }
  }  
}
