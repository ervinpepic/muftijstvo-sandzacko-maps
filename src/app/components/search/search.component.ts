import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { CustomMarker } from '../../interface/Marker';
import { HighlightSearchTermPipe } from '../../pipes/highlight-search-term.pipe';
import { FilterService } from '../../services/filter.service';
import { MarkerService } from '../../services/marker.service';
import { SearchService } from '../../services/search-suggestions.service';
import { substituteUsToBs } from '../../utils/latin-chars';
import { arrowKeyNavigation } from '../../utils/arrowKey-navigation';

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

  searchControl = new FormControl(); // create a form control property with no init values
  isSuggestionsVisible: boolean = false; // show or hide suggestion list in template
  suggestionsList: string[] = []; // save search suggestions here
  selectedSuggestionIndex: number = -1; // Init with -1 to indicate no suggestion selected

  // getters and setters from filter service
  get searchQuery(): string {
    return this.filterService.searchQuery;
  }
  set searchQuery(value: string) {
    this.filterService.searchQuery = value;
  }

  // filter markers on component level and share filtered data to a service
  filterMarkers(): CustomMarker[] {
    return this.filterService.filterMarkers(this.markerService.markers);
  }

  // Generates search suggestions based on user input
  // - Converts the input to lowercase and replaces Serbian Latin characters
  // - Retrieves filtered markers based on the current filter criteria
  // - Calls the search service to generate suggestions
  // - Updates the component's suggestionsList with the generated suggestions
  generateSearchSuggestions(inputValue: string): void {
    const normalizedSearchQuery = substituteUsToBs(inputValue.toLowerCase());
    const filteredMarkers = this.filterMarkers();
    const suggestion = this.searchService.generateSearchSuggestions(
      normalizedSearchQuery,
      filteredMarkers
    );
    this.suggestionsList = suggestion;
  }

  // Handles user input in the search input field
  // - Sets the value of the search control to the user input
  // - Generates search suggestions if the input is not empty
  // - Hides suggestions if the input is empty
  // - Updates the search query based on the input
  handleSearchInput(event: Event): void {
    // Close other info windows when user start typing into the input field
    this.markerService.markerEvent.closeOtherInfoWindows();

    // Get the input element and set search control value
    const inputElement = event.target as HTMLInputElement;
    this.searchControl.setValue(inputElement.value);

    // Show suggestions if input is not empty, otherwise hide them
    if (inputElement.value.length > 0) {
      this.generateSearchSuggestions(inputElement.value);
      this.isSuggestionsVisible = true;
    } else {
      this.isSuggestionsVisible = false;
    }
    // Update the search query based on the input
    this.updateSearchQuery(inputElement.value);
  }
  // Private method to check if input is numeric
  private isNumericInput(input: string): boolean {
    return /^\d+\/\d+$/.test(input) || /^\d+$/.test(input);
    // The regular expressions check if the input matches a specific pattern or consists of only digits
  }

  // Updates the search query based on user input
  // - Splits the input value into parts using space as a delimiter
  // - Extracts the first part (numberPart) for numeric input
  // - If numberPart matches a specific pattern or consists of only digits, updates the search query
  // - Otherwise, updates the search query with the entire input value
  updateSearchQuery(inputValue: string): void {
    const searchQueryParts = inputValue.split(' ');
    const numberPart = searchQueryParts[0];
    if (this.isNumericInput(numberPart)) {
      this.filterService.searchQuery = numberPart;
    } else {
      this.filterService.searchQuery = inputValue;
    }
  }

  // Handles the selection of a search suggestion
  // - Updates the search query based on the selected suggestion
  // - Hides the suggestions
  // - Calls filterMarkers to update markers based on the new search query
  selectSearchSuggestion(suggestion: string): void {
    this.updateSearchQuery(suggestion);
    this.isSuggestionsVisible = false;
    this.filterMarkers();
  }

  // Handles arrow key navigation within search suggestions
  handleArrowKeyNavigation(event: KeyboardEvent, index?: number): void {
    let currentIndex = index !== undefined ? index : 0;

    arrowKeyNavigation(
      event,
      currentIndex,
      this.suggestionsList,
      (query) => (this.searchQuery = query),
      (suggestion) => this.selectSearchSuggestion(suggestion)
    );
  }
}
