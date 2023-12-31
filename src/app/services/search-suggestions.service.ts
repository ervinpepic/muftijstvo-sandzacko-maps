import { Injectable } from '@angular/core';
import { CustomMarker } from '../Marker';
import { replaceUsToBs } from '../utils/latin-chars';
  // Adjust the path accordingly

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

      const normalizedInputValue = replaceUsToBs(inputValue.toLowerCase());

      const suggestionsMap = new Map<string, number>();

      visibleMarkers.forEach((marker) => {
        const normalizedVakufName = replaceUsToBs(marker.vakufName.toLowerCase());
        const normalizedCadastralParcelNumber = replaceUsToBs(marker.cadastralParcelNumber.toLowerCase());

        if (normalizedVakufName.includes(normalizedInputValue)) {
          // Assign a relevance score based on the match
          suggestionsMap.set(marker.vakufName, 1);
        }

        if (normalizedCadastralParcelNumber.includes(normalizedInputValue)) {
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
