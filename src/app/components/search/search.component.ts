import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { CustomMarker } from '../../Marker';
import { HighlightSearchTermPipe } from '../../pipes/highlight-search-term.pipe';
import { FilterService } from '../../services/filter.service';
import { MarkerService } from '../../services/marker.service';
import { SearchService } from '../../services/search-suggestions.service';

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

  // Input from parent component
  @Input() searchQuery: string = '';
  @Input() selectedCity: string | null = null;
  @Input() selectedVakufType: string | null = null;
  @Input() selectedVakufNames: string | null = null;

  searchFormControl = new FormControl();
  showSearchSuggestions: boolean = false;
  searchSuggestionsList: string[] = [];

  private getFilteredMarkers(): CustomMarker[] {
    return this.filterService.filterMarkers(
      this.markerService.markers,
      this.selectedCity || '',
      this.selectedVakufType || '',
      this.selectedVakufNames || '',
      this.searchQuery || ''
    );
  }

  async generateSearchSuggestions(value: string): Promise<void> {
    const filteredMarkers = this.getFilteredMarkers();
    const suggestion = await (this.searchSuggestionsList =
      this.searchService.generateSearchSuggestions(value, filteredMarkers));
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
    this.searchQuery = /^\d+$/.test(numberPart) ? numberPart : value;
  }

  handleSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchFormControl.setValue(inputElement.value);
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
