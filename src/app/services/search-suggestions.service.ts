import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CustomMarker } from '../interface/Marker';
import { MarkerService } from './marker.service';
// Adjust the path accordingly

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private indexedData: Map<string, CustomMarker[]> = new Map();

  constructor(private markerService: MarkerService) {
    this.indexData();
  }

  private indexData(): void {
    this.markerService.getMarkers().pipe(
      catchError(error => {
        console.error('Error fetching markers:', error);
        return EMPTY; // Return an empty observable to continue execution
      })
    ).subscribe(markers => {
      markers.forEach(marker => {
        this.addToIndex(marker.vakufName.toLowerCase(), marker);
        this.addToIndex(marker.cadastralParcelNumber.toLowerCase(), marker);
      });
      console.log('Markers indexed');
    });
  }

  private addToIndex(key: string, marker: CustomMarker): void {
    if (!this.indexedData.has(key)) {
      this.indexedData.set(key, []);
    }
    this.indexedData.get(key)!.push(marker);
  }

  generateSearchSuggestions(
    normalizedSearchQuery: string,
    filteredMarkers: CustomMarker[]
  ): string[] {
    try {
      const suggestionsSet = new Set<string>();

      filteredMarkers.forEach(marker => {
        const vakufName = marker.vakufName.toLowerCase();
        const cadastralParcelNumber = marker.cadastralParcelNumber.toLowerCase();

        if (vakufName.includes(normalizedSearchQuery)) {
          suggestionsSet.add(marker.vakufName);
        }

        if (cadastralParcelNumber.includes(normalizedSearchQuery)) {
          suggestionsSet.add(`${marker.cadastralParcelNumber} ${marker.vakufName}`);
        }
      });

      return Array.from(suggestionsSet).sort((a, b) =>
        this.calculateRelevance(a, b, normalizedSearchQuery)
      );
    } catch (error) {
      console.error('Error generating search suggestions:', error);
      return [];
    }
  }

  private calculateRelevance(a: string, b: string, inputValue: string): number {
    const relevanceA = a.toLowerCase().includes(inputValue) ? 1 : 0;
    const relevanceB = b.toLowerCase().includes(inputValue) ? 1 : 0;

    return relevanceB - relevanceA;
  }
}
