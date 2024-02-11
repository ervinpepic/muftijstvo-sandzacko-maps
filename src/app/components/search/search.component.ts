import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CustomMarker } from '../../interface/Marker';
import { HighlightSearchTermPipe } from '../../pipes/highlight-search-term.pipe';
import { FilterService } from '../../services/filter.service';
import { MarkerEventService } from '../../services/marker-event.service';
import { MarkerService } from '../../services/marker.service';
import { arrowKeyNavigation } from '../../utils/arrowKey-navigation';
import { generateSearchSuggestions } from '../../utils/generate-search-suggestions';

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
  private mapClickedSubscription: Subscription; // Subscription for map click event
  private previousListLength = 0;
  isSuggestionsVisible: boolean = false; // Indicates whether the search suggestions are visible
  suggestionsList: string[] = []; // List of search suggestions
  selectedSuggestionIndex: number = -1; // Index of the selected search suggestion

  // getters and setters from filter service
  get searchQuery(): string {
    return this.filterService.searchQuery;
  }
  set searchQuery(value: string) {
    this.filterService.searchQuery = value;
  }

  constructor(
    private markerService: MarkerService,
    private filterService: FilterService,
    private markerEventService: MarkerEventService
  ) {
    // Subscribe to map click event to hide suggestions
    this.mapClickedSubscription = this.markerEventService.mapClicked.subscribe(
      () => {
        if (this.isSuggestionsVisible) {
          this.isSuggestionsVisible = false;
        }
      }
    );
  }

  // Unsubscribe from subscriptions to avoid memory leaks
  ngOnDestroy(): void {
    if (this.mapClickedSubscription) {
      this.mapClickedSubscription.unsubscribe();
    }
  }

  // Filter markers on the component level using the FilterService
  // - Retrieves the array of markers from the MarkerService
  // - Filters the markers based on the current search criteria and filters
  // - Returns an array of CustomMarker objects representing the filtered markers
  // - Catches and logs any errors that occur during the filtering process
  updateMarkersVisibility(): CustomMarker[] {
    try {
      return this.filterService.filterMarkers(this.markerService.markers);
    } catch (error) {
      console.error('Error filtering markers:', error);
      return [];
    }
  }

  // Generates search suggestions based on user input
  // - Converts the input value to lowercase and substitutes Serbian Latin characters
  // - Retrieves filtered markers based on the current filter criteria using the FilterService
  // - Calls the SearchService to generate suggestions based on the normalized search query and filtered markers
  // - Updates the component's suggestionsList with the generated suggestions
  private generateSearchSuggestions(): void {
    const suggestions = generateSearchSuggestions(
      this.updateMarkersVisibility(),
      this.searchQuery
    );
    this.suggestionsList = suggestions;
  }

  // Handles user input in the search input field
  // - Closes other info windows to improve user experience
  // - Shows search suggestions if the input is not empty and updates visibility accordingly
  // - Hides search suggestions if the input is empty
  // - Updates the search query based on the input value
  handleSearchInputChange(inputValue: string): void {
    this.markerEventService.closeOtherInfoWindows(); // Close other info windows to prevent cluttering the interface
    // Show suggestions if the input is not empty, otherwise hide them
    if (inputValue.length > 0) {
      this.generateSearchSuggestions();
      this.isSuggestionsVisible = true;
    } else {
      this.isSuggestionsVisible = false;
    }
    this.updateSearchQuery(inputValue); // Update the search query based on the input value
  }

  // Private method to check if input is numeric
  // - The regular expressions check if the input matches a specific pattern or consists of only digits
  private isNumericInput(input: string): boolean {
    try {
      return /^\d+\/\d+$/.test(input) || /^\d+$/.test(input);
    } catch (error) {
      console.error('Error validating input:', error); //change better error handling in future
      return false;
    }
  }

  // Updates the search query based on user input
  // - Splits the input value into parts using space as a delimiter
  // - Extracts the first part (numberPart) for numeric input
  // - If numberPart matches a specific pattern or consists of only digits, updates the search query
  // - Otherwise, updates the search query with the entire input value
  private updateSearchQuery(inputValue: string): void {
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
    this.updateMarkersVisibility();
  }

  // Handles arrow key navigation within search suggestions
  navigateWithArrowKeys(event: KeyboardEvent, index?: number): void {
    try {
      let currentIndex = index !== undefined ? index : -1;
      arrowKeyNavigation(
        event,
        currentIndex,
        this.suggestionsList,
        (query) => (this.searchQuery = query),
        (suggestion) => this.selectSearchSuggestion(suggestion),
        this.previousListLength
      );
    } catch (error) {
      console.error('Error handling arrow key navigation:', error);
    }
  }
  
}
