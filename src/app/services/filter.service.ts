import { Injectable } from '@angular/core';
import { replaceSerbianLatinChars } from '../utils/latin-chars';
import { CustomMarker } from '../Marker';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private _searchQuery: string = '';
  private _selectedCity: string | null = null;
  private _selectedVakufType: string | null = null;
  private _selectedVakufNames: string | null = null;

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

  get selectedVakufNames(): string | null {
    return this._selectedVakufNames;
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

  set selectedVakufNames(value: string | null) {
    this._selectedVakufNames = value;
  }

  filterMarkers(markers: CustomMarker[]): CustomMarker[] {
    const visibleMarkers: CustomMarker[] = [];

    // Replace Serbian Latin characters in the search term
    const normalizedSearchTerm = replaceSerbianLatinChars(
      this.searchQuery.toLowerCase()
    );

    markers.forEach((marker) => {
      const { city, vakufType, vakufName, cadastralParcelNumber } = marker;
      const normalizedVakufName = replaceSerbianLatinChars(
        vakufName.toLowerCase()
      );

      const isVisible =
        (!this.selectedCity || city === this.selectedCity) &&
        (!this.selectedVakufType || vakufType === this.selectedVakufType) &&
        (!this.selectedVakufNames || vakufName === this.selectedVakufNames) &&
        (!normalizedSearchTerm ||
          normalizedVakufName.includes(normalizedSearchTerm) ||
          cadastralParcelNumber.toLowerCase().includes(normalizedSearchTerm));

      if (isVisible) {
        visibleMarkers.push(marker);
      }
    });

    return visibleMarkers;
  }
}
