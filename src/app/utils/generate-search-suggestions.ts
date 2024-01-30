import { CustomMarker } from '../interface/Marker';

export function generateSearchSuggestions(
  filteredMarkers: CustomMarker[],
  searchQuery: string
): string[] {
  try {
    const suggestionsSet = new Set<string>();
    const normalizedSearchQuery = searchQuery;

    filteredMarkers.forEach((marker) => {
      const vakufName = marker.vakufName.toLowerCase();
      const cadastralParcelNumber = marker.cadastralParcelNumber.toLowerCase();

      if (vakufName.includes(normalizedSearchQuery)) {
        suggestionsSet.add(marker.vakufName);
      }

      if (cadastralParcelNumber.includes(normalizedSearchQuery)) {
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
