import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { CustomMarker } from '../../Marker';
import { HighlightSearchTermPipe } from '../../pipes/highlight-search-term.pipe';
import { FilterService } from '../../services/filter.service';
import { MarkerService } from '../../services/marker.service';
import { SearchService } from '../../services/search-suggestions.service';
import { replaceSerbianLatinChars } from '../../utils/latin-chars';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [HighlightSearchTermPipe, CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  constructor(
    private markerService: MarkerService,
    private searchService: SearchService,
    private filterService: FilterService
  ) {}

  get searchQuery(): string {
    return this.filterService.searchQuery;
  }
  set searchQuery(value: string) {
    this.filterService.searchQuery = value;
  }

  searchControl = new FormControl();
  showSearchSuggestions: boolean = false;
  searchSuggestionsList: string[] = [];

  private getFilteredMarkers(): CustomMarker[] {
    return this.filterService.filterMarkers(this.markerService.markers);
  }

  generateSearchSuggestions(value: string): void {
    const normalizedSearchQuery = replaceSerbianLatinChars(value.toLowerCase());
    const filteredMarkers = this.getFilteredMarkers();
    const suggestion = this.searchService.generateSearchSuggestions(
      normalizedSearchQuery,
      filteredMarkers
    );
    // console.log('Suggestions:', suggestion);
    this.searchSuggestionsList = suggestion;
  }

  selectSearchSuggestion(suggestion: string): void {
    this.updateSearchQuery(suggestion);
    this.showSearchSuggestions = false;
    this.updateMarkersVisibility();
  }

  updateSearchQuery(value: string): void {
    const searchQueryParts = value.split(' ');
    const numberPart = searchQueryParts[0];
    this.filterService.searchQuery = /^\d+$/.test(numberPart)
      ? numberPart
      : value;
  }

  handleSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchControl.setValue(inputElement.value);
    if (inputElement.value.length > 0) {
      this.generateSearchSuggestions(inputElement.value);
      this.showSearchSuggestions = true;
    } else {
      this.showSearchSuggestions = false;
    }
    this.updateSearchQuery(inputElement.value);
  }

  updateMarkersVisibility(): void {
    const filteredMarkers = this.getFilteredMarkers();
    this.markerService.updateMarkersVisibility(filteredMarkers);
  }
}
