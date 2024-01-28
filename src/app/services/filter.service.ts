import { Injectable, NgZone } from '@angular/core';
import { debounceTime, take, tap } from 'rxjs/operators';
import { CustomMarker } from '../interface/Marker';
import { substituteUsToBs } from '../utils/latin-chars';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  constructor(private mapService: MapService, private ngZone: NgZone) {}

  private searchTimeDelay: number = 700; // Delay for debouncing search input
  private normalizedSearchTerm: string = ''; // Normalized search term

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
    this.normalizedSearchTerm = substituteUsToBs(
      this.searchQuery.toLowerCase()
    );

    // Iterate through each marker and update visibility
    markers.forEach((marker) => {
      const isVisible = this.isVisibleMarker(marker);
      marker.setVisible(isVisible);
    });

    // Filter out visible markers
    const visibleMarkers = markers.filter((marker) => marker.getVisible());

    // Update map bounds based on visible markers
    this.updateBounds(visibleMarkers);

    return visibleMarkers;
  }

  /**
   * Checks if a marker is visible based on the filter criteria.
   * @param marker - The marker to check visibility for.
   * @returns A boolean indicating if the marker is visible.
   */
  private isVisibleMarker(marker: CustomMarker): boolean {
    const { city, vakufType, vakufName, cadastralParcelNumber } = marker;
    const normalizedVakufName = substituteUsToBs(vakufName.toLowerCase());

    // Check if the marker matches the filter criteria
    const matchesCity = !this.selectedCity || city === this.selectedCity;
    const matchesVakufType =
      !this.selectedVakufType || vakufType === this.selectedVakufType;
    const matchesVakufName =
      !this.selectedVakufName || vakufName === this.selectedVakufName;
    const matchesSearchTerm =
      !this.normalizedSearchTerm ||
      normalizedVakufName.includes(this.normalizedSearchTerm) ||
      cadastralParcelNumber.toLowerCase().includes(this.normalizedSearchTerm);

    return (
      matchesCity && matchesVakufType && matchesVakufName && matchesSearchTerm
    );
  }

  /**
   * Updates the map bounds based on the visible markers.
   * @param markers - The visible markers to calculate bounds from.
   */
  private updateBounds(markers: CustomMarker[]): void {
    const bounds = new google.maps.LatLngBounds();

    // Extend bounds with each visible marker's position
    markers.forEach((marker) => {
      const position = marker.getPosition();
      if (position) {
        bounds.extend(position);
      }
    });

    // Fit map bounds to visible markers
    if (markers.length > 0) {
      this.mapService.map$
        .pipe(
          take(1),
          debounceTime(this.searchTimeDelay),
          tap(() => {
            this.mapService.map?.fitBounds(bounds);
          })
        )
        .subscribe();
    }
  }
}
