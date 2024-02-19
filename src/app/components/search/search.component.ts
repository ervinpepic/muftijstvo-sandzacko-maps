import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { VakufMarkerDetails } from '../../interface/Marker';
import { HighlightSearchTermPipe } from '../../pipes/highlight-search-term.pipe';
import { FilterService } from '../../services/filter.service';
import { MarkerEventService } from '../../services/marker-event.service';
import { MarkerService } from '../../services/marker.service';
import { handleSearchNavigationKeys } from '../../utils/arrow-key-handler';
import { generateSearchSuggestions } from '../../utils/generate-search-suggestions';
import { isNumericInput, validateInputField } from '../../utils/input-validators';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [HighlightSearchTermPipe, CommonModule, FormsModule, ScrollingModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit, OnDestroy {
  suggestionsList: string[] = []; // Holds the list of search suggestions.
  selectedSuggestionIndex: number = -1; // The index of the currently selected search suggestion.
  isSuggestionsVisible: boolean = false; // Indicates the visibility of search suggestions.

  protected searchQueryChanges = new Subject<string>(); // Search debouncing container
  private destroy$ = new Subject<void>(); // Subscription remover
  @ViewChild(CdkVirtualScrollViewport) viewport?: CdkVirtualScrollViewport;

  /**
   * Getter for searchQuery. Retrieves the current search query from the FilterService.
   * @returns {string} The current search query.
   */
  get searchQuery(): string {
    return this.filterService.searchQuery;
  }

  /**
   * Setter for searchQuery. Updates the search query in the FilterService.
   * @param {string} value - The new value for the search query.
   */
  set searchQuery(value: string) {
    this.filterService.searchQuery = value;
  }

  constructor(
    private markerService: MarkerService,
    private filterService: FilterService,
    private markerEventService: MarkerEventService,
  ) { }

  ngOnInit(): void {
    this.markerEventService.mapClicked
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isSuggestionsVisible = false;
      });
    this.searchQueryChanges.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe((inputValue) => {
      if (inputValue.length > 0 && validateInputField(inputValue)) {
        this.filterMarkers();
        this.generateSuggestions(inputValue);
        this.isSuggestionsVisible = true
      } else {
        this.isSuggestionsVisible = false
        this.suggestionsList = [];
      }
      if (inputValue === '') {
        this.filterMarkers();
      }
    });
  }

  /**
   * Cleans up resources and subscriptions when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Filters markers at the component level using the FilterService.
   * Retrieves, filters based on search criteria and filters, and returns an array of filtered markers.
   * @returns {VakufMarkerDetails[]} An array of CustomMarker objects representing the filtered markers.
   * @throws {Error} When an error occurs during the filtering process.
   */
  private filterMarkers(): void {
    try {
      this.filterService.filterMarkers(this.markerService.markers);
    } catch (error) {
      console.error('Error filtering markers:', error);
    }
  }

  /**
   * Generates search suggestions based on user input.
   * Normalizes input, retrieves filtered markers, and updates suggestionsList.
   */
  private generateSuggestions(inputValue: string): void {
    const filteredMarkerData = this.filterService.filteredMarkers
      .map((marker) => this.markerService.markerDataMap.get(marker))
      .filter((markerData) => markerData?.vakufName) as VakufMarkerDetails[];
    const suggestions = generateSearchSuggestions(filteredMarkerData, inputValue);
    this.suggestionsList = suggestions;
  }

  /**
   * Updates the search query based on user input, splitting and analyzing the input value.
   * @param {string} inputValue - The input value from the search field.
   */
  private updateSearchQuery(inputValue: string): void {
    const searchQueryParts = inputValue.split(' ');
    const numberPart = searchQueryParts[0];
    if (isNumericInput(numberPart)) {
      this.filterService.searchQuery = numberPart;
    } else {
      this.filterService.searchQuery = inputValue;
    }
  }

  /**
   * Handles selection of a search suggestion, updating the query and hiding suggestions.
   * @param {string} suggestion - The selected search suggestion.
   */
  protected selectSearchSuggestion(suggestion: string): void {
    this.updateSearchQuery(suggestion);
    this.isSuggestionsVisible = false;
    this.filterMarkers();
  }

  /**
   * Handles keyboard navigation within the search suggestions using arrow keys.
   * Updates the selected suggestion index based on keyboard input.
   * @param {KeyboardEvent} event - The keyboard event.
   * @param {number} [index] - The current index of the selected suggestion.
   * @throws {Error} When an error occurs during navigation handling.
   */
  protected handleSearchNavigationKeys(event: KeyboardEvent, index?: number): void {
    try {
      let currentIndex =
        index !== undefined ? index : this.selectedSuggestionIndex;
      currentIndex = handleSearchNavigationKeys(
        event.key,
        currentIndex,
        this.suggestionsList,
        (currentIndex) =>
          this.selectSearchSuggestion(this.suggestionsList[currentIndex]),
        this.viewport!
      );
      this.selectedSuggestionIndex = currentIndex;
    } catch (error) {
      console.error('Error handling arrow key navigation:', error);
    }
  }
}
