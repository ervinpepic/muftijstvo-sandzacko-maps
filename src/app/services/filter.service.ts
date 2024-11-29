import { Injectable } from '@angular/core';
import { debounceTime, take } from 'rxjs/operators';
import { Marker } from '../interface/Marker';
import { normalizeString } from '../utils/input-validators';
import { MapService } from './map.service';
import { MarkerService } from './marker.service';

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
  ) { }

  map?: google.maps.Map;
  private searchTimeDelay: number = 800; // Delay for debouncing search input

  private _searchQuery: string = ''; // Search query string
  private _selectedCity: string | null = null; // Selected city filter
  private _selectedVakufType: string | null = null; // Selected vakuf type filter
  private _selectedVakufName: string | null = null; // Selected vakuf name filter
  private _filteredMarkers: google.maps.marker.AdvancedMarkerElement[] = [];

  // Getter methods to expose values// In FilterService

  public get filteredMarkers(): google.maps.marker.AdvancedMarkerElement[] {
    return this._filteredMarkers;
  }

  private setFilteredMarkers(markers: google.maps.marker.AdvancedMarkerElement[]): void {
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
    // Normalize the search query
    const normalizedSearchTerm = this.normalizeSearchTerm(this.searchQuery);
    const bounds = new google.maps.LatLngBounds();
    const visibleMarkers: google.maps.marker.AdvancedMarkerElement[] = [];

    markers.forEach((marker) => {
      // Retrieve the custom data for the marker
      const customData = this.markerService.markerDataMap.get(marker);

      if (customData) {
        const isVisible = this.isVisibleMarker(customData, normalizedSearchTerm);
        this.setMarkerVisibility(marker, isVisible);

        if (isVisible) {
          bounds.extend(marker.position as google.maps.LatLng | google.maps.LatLngLiteral);
          visibleMarkers.push(marker); // Collect visible markers directly
        }
      }
    });

    if (visibleMarkers.length > 0) {
      this.fitBoundsAfterDelay(bounds);
    }

    if (this.markerService.markerCluster) {
      this.markerService.markerCluster.clearMarkers();
      this.markerService.markerCluster.addMarkers(visibleMarkers);
    }
    this.setFilteredMarkers(visibleMarkers);
    return visibleMarkers;
  }

  /**
   * Checks if a marker is visible based on the filter criteria.
   * @param data - The marker to check visibility for.
   * @param searchTerm - The normalized search term.
   * @returns A boolean indicating if the marker is visible.
   */
  private isVisibleMarker(data: Marker, searchTerm: string): boolean {
    const { city, vakufType, vakufName, cadastralParcelNumber } = data;
    const normalizedVakufName = this.normalizeSearchTerm(vakufName); // Normalize vakufName here

    // Check if the marker matches the filter criteria
    const matchesCity = !this.selectedCity || city === this.selectedCity;
    const matchesVakufType =
      !this.selectedVakufType || vakufType === this.selectedVakufType;
    const matchesVakufName =
      !this.selectedVakufName ||
      normalizedVakufName === this.normalizeSearchTerm(this.selectedVakufName); // Use normalizedVakufName here
    const matchesSearchTerm =
      !searchTerm ||
      normalizedVakufName.includes(searchTerm) ||
      cadastralParcelNumber.toLowerCase().includes(searchTerm);

    return (
      matchesCity && matchesVakufType && matchesVakufName && matchesSearchTerm
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
   * Sets the visibility of a marker.
   * @param marker - The marker to set visibility for.
   * @param isVisible - A boolean indicating whether the marker should be visible.
   */
  private setMarkerVisibility(marker: google.maps.marker.AdvancedMarkerElement, isVisible: boolean): void {
    marker.map = isVisible ? this.map : null;
  }

  /**
   * Fits map bounds to visible markers after a delay.
   * @param bounds - The bounds to fit.
   */
  private fitBoundsAfterDelay(bounds: google.maps.LatLngBounds): void {
    this.mapService.map$
      .pipe(debounceTime(this.searchTimeDelay), take(1))
      .subscribe({
        next: () => this.mapService.map?.fitBounds(bounds),
        error: (err) => console.error('Error adjusting map bounds:', err),
      });
  }
}
