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
  get filteredMarkers(): google.maps.marker.AdvancedMarkerElement[] {
    return this._filteredMarkers;
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
  set filteredMarkers(markers: google.maps.marker.AdvancedMarkerElement[]) {
    this._filteredMarkers = markers;
  }
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
  filterMarkers(
    markers: google.maps.marker.AdvancedMarkerElement[]
  ): google.maps.marker.AdvancedMarkerElement[] {
    const normalizedSearchTerm = this.normalizeSearchTerm(this.searchQuery);
    const bounds = new google.maps.LatLngBounds();

    const visibleMarkers = markers.filter((marker) => {
      const customData = this.markerService.markerDataMap.get(marker);
      const isVisible = customData && this.isVisibleMarker(customData, normalizedSearchTerm);

      marker.map = isVisible ? this.map : null;

      if (isVisible) {
        bounds.extend(
          marker.position as google.maps.LatLng | google.maps.LatLngLiteral
        );
      }
      return isVisible;
    });

    if (visibleMarkers.length > 0) {
      this.fitBoundsAfterDelay(bounds);
    }

    this.filteredMarkers = visibleMarkers;
    return visibleMarkers;
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

  public hasActiveFilters(): boolean {
    const active =
      !!this.searchQuery ||
      !!this.selectedVakufType ||
      !!this.selectedCity ||
      !!this.selectedVakufName;
    console.log('Active Filters:', {
      searchQuery: this.searchQuery,
      vakufType: this.selectedVakufType,
      city: this.selectedCity,
      vakufName: this.selectedVakufName,
      hasActiveFilters: active,
    });
    return active;
  }

  public resetMapToInitialState(): void {
    console.log('Checking reset conditions...');
    if (!this.hasActiveFilters()) {
      console.log('Resetting map to initial state');
      this.markerService.markers.forEach((marker) => {
        marker.map = this.mapService.map; // Re-attach all markers to the map
      });

      setTimeout(() => {
        const initialZoomLevel = getInitialZoomLevel(); // Ensure this function returns a valid zoom level
        this.mapService.map!.setZoom(initialZoomLevel); // Apply initial zoom
        this.mapService.map!.setCenter(CENTER); // Apply initial center (make sure CENTER is defined)
      }, 300);

      this.filteredMarkers = this.markerService.markers; // Update the filtered markers
    } else {
      console.log('Filters are still active; no reset performed.');
    }
  }
}
