import { Injectable } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { CustomMarker } from '../interface/Marker';
import { substituteUsToBs } from '../utils/latin-chars';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  constructor(private mapService: MapService) {}

  private searchTimeDelay: number = 800; // Delay for debouncing search input

  private _searchQuery: string = ''; // Search query string
  private _selectedCity: string | null = null; // Selected city filter
  private _selectedVakufType: string | null = null; // Selected vakuf type filter
  private _selectedVakufName: string | null = null; // Selected vakuf name filter

  // Getter methods to expose values
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
  filterMarkers(markers: CustomMarker[]): CustomMarker[] {
    // Normalize the search query
    const normalizedSearchTerm = this.normalizeSearchTerm(this.searchQuery);
    try {
      const bounds = new google.maps.LatLngBounds();

      // Filter markers and update visibility, and calculate bounds in a single pass
      markers.forEach((marker) => {
        const isVisible = this.isVisibleMarker(marker, normalizedSearchTerm);
        const currentVisibility = marker.getVisible();

        // Check if the visibility state needs to be changed
        if (isVisible !== currentVisibility) {
          this.setMarkerVisibility(marker, isVisible);
        }

        if (isVisible) {
          bounds.extend(marker.getPosition()!); // Assume getPosition() always returns LatLng | null
        }
      });

      // Fit map bounds to visible markers after the debounce time
      const visibleMarkers = markers.filter((marker) => marker.getVisible());
      if (visibleMarkers.length > 0) {
        this.fitBoundsAfterDelay(bounds);
      }

      return visibleMarkers;
    } catch (error) {
      console.error('Error filtering markers:', error);
      // You can handle the error here, such as showing an error message to the user or logging it
      return [];
    }
  }

  /**
   * Checks if a marker is visible based on the filter criteria.
   * @param marker - The marker to check visibility for.
   * @param searchTerm - The normalized search term.
   * @returns A boolean indicating if the marker is visible.
   */
  private isVisibleMarker(marker: CustomMarker, searchTerm: string): boolean {
    const { city, vakufType, vakufName, cadastralParcelNumber } = marker;
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
    return term ? substituteUsToBs(term.toLowerCase()) : '';
  }

  /**
   * Sets the visibility of a marker.
   * @param marker - The marker to set visibility for.
   * @param isVisible - A boolean indicating whether the marker should be visible.
   */
  private setMarkerVisibility(marker: CustomMarker, isVisible: boolean): void {
    marker.setVisible(isVisible);
  }

  /**
   * Fits map bounds to visible markers after a delay.
   * @param bounds - The bounds to fit.
   */
  private fitBoundsAfterDelay(bounds: google.maps.LatLngBounds): void {
    this.mapService.map$
      .pipe(debounceTime(this.searchTimeDelay))
      .subscribe(() => {
        this.mapService.map?.fitBounds(bounds);
      });
  }
}
