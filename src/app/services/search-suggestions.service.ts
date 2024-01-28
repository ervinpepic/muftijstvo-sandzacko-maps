import { Injectable } from '@angular/core';
import { CustomMarker } from '../interface/Marker';
import { substituteUsToBs } from '../utils/latin-chars';
import { BehaviorSubject } from 'rxjs';
import { MarkerService } from './marker.service';
import { filter } from 'rxjs/operators';
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
    // Use BehaviorSubject to keep track of when markers are loaded
    const markersLoaded = new BehaviorSubject<boolean>(false);

    // Subscribe to markerService to get markers
    this.markerService.getMarkers().subscribe((markers) => {
      markers.forEach((marker) => {
        const normalizedVakufName = substituteUsToBs(
          marker.vakufName.toLowerCase()
        );
        const normalizedCadastralParcelNumber = substituteUsToBs(
          marker.cadastralParcelNumber.toLowerCase()
        );

        if (!this.indexedData.has(normalizedVakufName)) {
          this.indexedData.set(normalizedVakufName, []);
        }
        this.indexedData.get(normalizedVakufName)!.push(marker);

        if (!this.indexedData.has(normalizedCadastralParcelNumber)) {
          this.indexedData.set(normalizedCadastralParcelNumber, []);
        }
        this.indexedData.get(normalizedCadastralParcelNumber)!.push(marker);
      });

      // Markers are now loaded, notify subscribers
      markersLoaded.next(true);
    });

    // Ensure indexing only happens after markers are loaded
    markersLoaded.pipe(filter((loaded) => loaded)).subscribe(() => {
      // Indexing completed
      console.log('Markers indexed');
    });
  }

  generateSearchSuggestions(
    normalizedSearchQuery: string,
    filteredMarkers: CustomMarker[]
  ): string[] {
    try {
      // Use a Set to store unique suggestions
      const suggestionsSet = new Set<string>();
  
      // Search filtered markers for matches
      filteredMarkers.forEach(marker => {
        const normalizedVakufName = substituteUsToBs(marker.vakufName.toLowerCase());
        const normalizedCadastralParcelNumber = substituteUsToBs(marker.cadastralParcelNumber.toLowerCase());
  
        if (normalizedVakufName.includes(normalizedSearchQuery)) {
          suggestionsSet.add(marker.vakufName);
        }
  
        if (normalizedCadastralParcelNumber.includes(normalizedSearchQuery)) {
          suggestionsSet.add(`${marker.cadastralParcelNumber} ${marker.vakufName}`);
        }
      });
  
      // Convert Set to array and sort by relevance
      const sortedSuggestions = Array.from(suggestionsSet).sort((a, b) =>
        this.calculateRelevance(a, b, normalizedSearchQuery)
      );
  
      return sortedSuggestions;
    } catch (error) {
      console.error('Error generating search suggestions:', error);
      return [];
    }
  }

  private calculateRelevance(a: string, b: string, inputValue: string): number {
    // Custom logic to calculate relevance, you can adjust this based on your requirements
    const relevanceA = a.toLowerCase().includes(inputValue) ? 1 : 0;
    const relevanceB = b.toLowerCase().includes(inputValue) ? 1 : 0;

    return relevanceB - relevanceA; // Sort in descending order of relevance
  }
}
