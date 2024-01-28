import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomMarker } from '../../interface/Marker';
import { HighlightSearchTermPipe } from '../../pipes/highlight-search-term.pipe';
import { FilterService } from '../../services/filter.service';
import { MarkerEventService } from '../../services/marker-event.service';
import { MarkerService } from '../../services/marker.service';
import { SearchService } from '../../services/search-suggestions.service';
import { arrowKeyNavigation } from '../../utils/arrowKey-navigation';
import { substituteUsToBs } from '../../utils/latin-chars';
import { Subscription } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    HighlightSearchTermPipe,
    CommonModule,
    FormsModule,
    ScrollingModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnDestroy {
  isSuggestionsVisible: boolean = false; // show or hide suggestion list in template
  private mapClickedSubscription: Subscription;
  suggestionsList: string[] = []; // save search suggestions here
  selectedSuggestionIndex: number = -1; // Init with -1 to indicate no suggestion selected

  constructor(
    private markerService: MarkerService,
    private searchService: SearchService,
    private filterService: FilterService,
    private markerEventService: MarkerEventService
  ) {
    this.mapClickedSubscription = this.markerEventService.mapClicked.subscribe(
      () => {
        this.hideSuggestionsIfVisible();
      }
    );
  }
  ngOnDestroy(): void {
    // Unsubscribe from subscriptions to avoid memory leaks
    if (this.mapClickedSubscription) {
      this.mapClickedSubscription.unsubscribe();
    }
  }
  hideSuggestionsIfVisible(): void {
    if (this.isSuggestionsVisible) {
      this.isSuggestionsVisible = false;
    }
  }

  // getters and setters from filter service
  get searchQuery(): string {
    return this.filterService.searchQuery;
  }
  set searchQuery(value: string) {
    this.filterService.searchQuery = value;
  }

  // filter markers on component level and share filtered data to a service
  filterMarkers(): CustomMarker[] {
    try {
      return this.filterService.filterMarkers(this.markerService.markers);
    } catch (error) {
      console.error('Error filtering markers:', error);
      // Handle the error gracefully, perhaps by showing a message to the user
      return [];
    }
  }

  // Generates search suggestions based on user input
  // - Converts the input to lowercase and replaces Serbian Latin characters
  // - Retrieves filtered markers based on the current filter criteria
  // - Calls the search service to generate suggestions
  // - Updates the component's suggestionsList with the generated suggestions
  generateSearchSuggestions(inputValue: string): void {
    const normalizedSearchQuery = substituteUsToBs(inputValue.toLowerCase());
    const filteredMarkers = this.filterMarkers();
    const suggestions = this.searchService.generateSearchSuggestions(
      normalizedSearchQuery,
      filteredMarkers
    );
    this.suggestionsList = suggestions;
  }

  // Handles user input in the search input field
  // - Sets the value of the search control to the user input
  // - Generates search suggestions if the input is not empty
  // - Hides suggestions if the input is empty
  // - Updates the search query based on the input
  handleSearchInputChange(inputValue: string): void {
    // Close other info windows when user starts typing into the input field
    this.markerEventService.closeOtherInfoWindows();

    // Show suggestions if input is not empty, otherwise hide them
    if (inputValue.length > 0) {
      this.generateSearchSuggestions(inputValue);
      this.isSuggestionsVisible = true;
    } else {
      this.isSuggestionsVisible = false;
    }

    // Update the search query based on the input directly using ngModel
    this.updateSearchQuery(inputValue);
  }
  // Private method to check if input is numeric
  private isNumericInput(input: string): boolean {
    try {
      return /^\d+\/\d+$/.test(input) || /^\d+$/.test(input);
    } catch (error) {
      console.error('Error validating input:', error);
      // Handle the error gracefully, perhaps by returning false or showing a message to the user
      return false;
    }
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
  navigateWithArrowKeys(event: KeyboardEvent, index?: number): void {
    try {
      let currentIndex = index !== undefined ? index : 0;
      arrowKeyNavigation(
        event,
        currentIndex,
        this.suggestionsList,
        (query) => (this.searchQuery = query),
        (suggestion) => this.selectSearchSuggestion(suggestion)
      );
    } catch (error) {
      console.error('Error handling arrow key navigation:', error);
      // Handle the error gracefully, perhaps by logging it or showing a message to the user
    }
  }
}
