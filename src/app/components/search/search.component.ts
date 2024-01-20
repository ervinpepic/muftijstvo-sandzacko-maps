import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { CustomMarker } from '../../interface/Marker';
import { HighlightSearchTermPipe } from '../../pipes/highlight-search-term.pipe';
import { FilterService } from '../../services/filter.service';
import { MarkerService } from '../../services/marker.service';
import { SearchService } from '../../services/search-suggestions.service';
import { substituteUsToBs } from '../../utils/latin-chars';

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
  showSuggestions: boolean = false; // show or hide suggestion list in template
  suggestionsList: string[] = []; // save search suggestions here

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
  // - If the input is not empty, generates search suggestions and shows them
  // - If the input is empty, hides the suggestions
  // - Calls updateSearchQuery to update the search query based on the input
  handleSearchInput(event: Event): void {
    this.markerService.markerEvent.closeOtherInfoWindows();
    const inputElement = event.target as HTMLInputElement;
    this.searchControl.setValue(inputElement.value);
    if (inputElement.value.length > 0) {
      this.generateSearchSuggestions(inputElement.value);
      this.showSuggestions = true;
    } else {
      this.showSuggestions = false;
    }
    this.updateSearchQuery(inputElement.value);
  }

  // Updates the search query based on user input
  // - Splits the input value into parts using space as a delimiter
  // - Extracts the first part (numberPart) for numeric input
  // - If numberPart matches a specific pattern or consists of only digits, updates the search query
  // - Otherwise, updates the search query with the entire input value
  updateSearchQuery(inputValue: string): void {
    const searchQueryParts = inputValue.split(' ');
    const numberPart = searchQueryParts[0];
    if (/^\d+\/\d+$/.test(numberPart) || /^\d+$/.test(numberPart)) {
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
    this.showSuggestions = false;
    this.filterMarkers();
  }
  handleArrowNavigation(event: KeyboardEvent, index?: number): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();

      const suggestions = document.querySelectorAll(
        '.search-suggestions .hover-effect'
      );
      let currentIndex = index !== undefined ? index : 0;

      if (event.key === 'ArrowDown') {
        currentIndex =
          currentIndex < suggestions.length - 1 ? currentIndex + 1 : 0;
      } else if (event.key === 'ArrowUp') {
        currentIndex =
          currentIndex > 0 ? currentIndex - 1 : suggestions.length - 1;
      }

      const selectedSuggestion = suggestions[currentIndex] as HTMLLIElement;
      selectedSuggestion.focus();
      this.searchQuery = this.suggestionsList[currentIndex];
    }
  }
}
