import { Injectable } from '@angular/core';
import { CustomMarker } from '../Marker';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  
  generateSearchSuggestions(
    inputValue: string,
    visibleMarkers: CustomMarker[]
  ): string[] {
    try {
      if (!Array.isArray(visibleMarkers) || visibleMarkers.length === 0) {
        return [];
      }

      const suggestionsMap = new Map<string, number>();

      visibleMarkers.forEach((marker) => {
        const lowercaseInput = inputValue.toLowerCase();

        if (marker.vakufName.toLowerCase().includes(lowercaseInput)) {
          // Assign a relevance score based on the match
          suggestionsMap.set(marker.vakufName, 1);
        }

        if (
          marker.cadastralParcelNumber.toLowerCase().includes(lowercaseInput)
        ) {
          const suggestion = `${marker.cadastralParcelNumber} (${marker.vakufName})`;
          // Assign a higher relevance score for suggestions with both parcel number and name
          suggestionsMap.set(suggestion, 2);
        }
      });

      // Sort suggestions based on relevance score
      const sortedSuggestions = Array.from(suggestionsMap.keys()).sort(
        (a, b) => suggestionsMap.get(b)! - suggestionsMap.get(a)!
      );

      return sortedSuggestions;
    } catch (error) {
      console.error('Error generating search suggestions:', error);
      return [];
    }
  }
}
