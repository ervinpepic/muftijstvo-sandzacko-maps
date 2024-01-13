import { Injectable } from '@angular/core';
import { CustomMarker } from '../interface/Marker';
import { substituteUsToBs } from '../utils/latin-chars';
// Adjust the path accordingly

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  /**
   * Generates search suggestions based on the input value and visible markers.
   * @param inputValue - The search input value.
   * @param visibleMarkers - The array of visible markers.
   * @returns An array of search suggestions.
   */

  generateSearchSuggestions(
    inputValue: string,
    visibleMarkers: CustomMarker[]
  ): string[] {
    try {
      // Ensure that visibleMarkers is an array and not empty
      if (!Array.isArray(visibleMarkers) || visibleMarkers.length === 0) {
        return [];
      }

      const normalizedInputValue = substituteUsToBs(inputValue.toLowerCase());

      // Use a Map to store suggestions and their relevance scores
      const suggestionsMap = new Map<string, number>();

      visibleMarkers.forEach((marker) => {
        const normalizedVakufName = substituteUsToBs(
          marker.vakufName.toLowerCase()
        );
        const normalizedCadastralParcelNumber = substituteUsToBs(
          marker.cadastralParcelNumber.toLowerCase()
        );

        if (normalizedVakufName.includes(normalizedInputValue)) {
          // Assign a relevance score based on the match
          suggestionsMap.set(marker.vakufName, 1);
        }

        if (normalizedCadastralParcelNumber.includes(normalizedInputValue)) {
          const suggestion = `${marker.cadastralParcelNumber} ${marker.vakufName}`;
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
      // Log and handle errors gracefull
      console.error('Error generating search suggestions:', error);
      return [];
    }
  }
}
