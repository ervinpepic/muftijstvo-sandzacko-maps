import { Injectable } from '@angular/core';
import { CustomMarker } from '../interface/Marker';
import { substituteUsToBs } from '../utils/latin-chars';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  
  constructor(private mapService: MapService) {}

  private _searchQuery: string = '';
  private _selectedCity: string | null = null;
  private _selectedVakufType: string | null = null;
  private _selectedVakufName: string | null = null;

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

  filterMarkers(markers: any[]): CustomMarker[] {
    const visibleMarkers: CustomMarker[] = [];
    const bounds = new google.maps.LatLngBounds(); // Initialize bounds
    // Replace Serbian Latin characters in the search term
    const normalizedSearchTerm = substituteUsToBs(
      this.searchQuery.toLowerCase()
    );

    markers.forEach((marker) => {
      const { city, vakufType, vakufName, cadastralParcelNumber } = marker;
      const normalizedVakufName = substituteUsToBs(vakufName.toLowerCase());

      const isVisible =
        (!this.selectedCity || city === this.selectedCity) &&
        (!this.selectedVakufType || vakufType === this.selectedVakufType) &&
        (!this.selectedVakufName || vakufName === this.selectedVakufName) &&
        (!normalizedSearchTerm ||
          normalizedVakufName.includes(normalizedSearchTerm) ||
          cadastralParcelNumber.toLowerCase().includes(normalizedSearchTerm));

      marker.setVisible(isVisible);

      if (isVisible) {
        visibleMarkers.push(marker);
        bounds.extend(marker.getPosition());
      }
    });
    if (visibleMarkers.length > 0) {
      setTimeout(() => {
        this.mapService.map?.fitBounds(bounds);
      }, 500);
    }

    return visibleMarkers;
  }
}
