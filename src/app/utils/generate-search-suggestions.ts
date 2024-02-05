import { CustomMarker } from '../interface/Marker';
import { normalizeString } from './latin-chars';

export function generateSearchSuggestions(
  filteredMarkers: CustomMarker[],
  searchQuery: string
): string[] {
  try {
    const suggestionsSet = new Set<string>();
    const normalizedSearchQuery = normalizeString(searchQuery); // Remove lowercase here

    filteredMarkers.forEach((marker) => {
      const normalizedVakufName = normalizeString(marker.vakufName); // Normalize vakufName here
      const normalizedCadastralParcelNumber = normalizeString(
        marker.cadastralParcelNumber
      ); // Normalize cadastralParcelNumber here

      if (normalizedVakufName.includes(normalizedSearchQuery)) {
        suggestionsSet.add(marker.vakufName);
      }

      if (normalizedCadastralParcelNumber.includes(normalizedSearchQuery)) {
        suggestionsSet.add(
          `${marker.cadastralParcelNumber} ${marker.vakufName}`
        );
      }
    });

    return Array.from(suggestionsSet).sort((a, b) =>
      calculateRelevance(a, b, normalizedSearchQuery)
    );
  } catch (error) {
    console.error('Error generating search suggestions:', error);
    return [];
  }
}

function calculateRelevance(a: string, b: string, inputValue: string): number {
  const relevanceA = a.toLowerCase().includes(inputValue) ? 1 : 0;
  const relevanceB = b.toLowerCase().includes(inputValue) ? 1 : 0;

  return relevanceB - relevanceA;
}
