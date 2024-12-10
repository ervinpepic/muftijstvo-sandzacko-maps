import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { Marker } from '../../interface/Marker';
import { HighlightSearchTermPipe } from '../../pipes/highlight-search-term.pipe';
import { FilterService } from '../../services/filter.service';
import { MarkerService } from '../../services/marker.service';
import { handleSearchNavigationKeys } from '../../utils/arrow-key-handler';
import { generateSearchSuggestions } from '../../utils/generate-search-suggestions';
import {
  isNumericInput,
  validateInputField,
} from '../../utils/input-validators';

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
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport) viewport?: CdkVirtualScrollViewport;

  protected searchSuggestionsList: string[] = []; // Holds the list of search suggestions.
  protected selectedSuggestionIndex: number = -1; // The index of the currently selected search suggestion.
  protected isSuggestionsVisible: boolean = false; // Indicates the visibility of search suggestions.
  protected selectedNumberOfMarkers?: number; //Holds the number of selected suggestions.

  protected searchQueryChanges = new Subject<string>(); // Search debouncing container
  private destroy$ = new Subject<void>(); // Subscription remover

  get searchQuery(): string {
    return this.filterService.searchQuery;
  }

  set searchQuery(value: string) {
    this.filterService.searchQuery = value;
  }

  constructor(
    private markerService: MarkerService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.searchQueryChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((inputValue) => {
        if (validateInputField(inputValue)) {
          this.filterMarkers();
          this.generateSuggestions(inputValue);
          this.isSuggestionsVisible = true;
        } else if (!inputValue.trim()) {
          this.resetSuggestions();
          this.filterService.resetMapToInitialState();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Filters markers at the component level using the FilterService.
   * Retrieves, filters based on search criteria and filters, and returns an array of filtered markers.
   * @throws {Error} When an error occurs during the filtering process.
   */
  private filterMarkers(): void {
    try {
      const filteredMarkers = this.filterService.filterMarkers(
        this.markerService.markers
      );
      filteredMarkers.forEach((marker) => {
        marker.map = this.markerService.map;
      });
      this.selectedNumberOfMarkers = filteredMarkers.length;
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
      .filter((markerData) => markerData?.vakufName) as Marker[];

    this.searchSuggestionsList =
      generateSearchSuggestions(filteredMarkerData, inputValue) || [];
    this.isSuggestionsVisible = this.searchSuggestionsList.length > 0;
  }

  /**
   * Handles selection of a search suggestion, updating the query and hiding suggestions.
   * @param {string} suggestion - The selected search suggestion.
   */
  protected selectSearchSuggestion(suggestion: string): void {
    this.updateSearchQuery(suggestion);
    this.resetSuggestions();
    this.filterMarkers();
  }

  /**
   * Updates the search query based on user input, splitting and analyzing the input value.
   * @param {string} inputValue - The input value from the search field.
   */
  private updateSearchQuery(inputValue: string): void {
    if (!inputValue.trim()) {
      return;
    }
    const [numberPart] = inputValue.split(' ');
    this.filterService.searchQuery = isNumericInput(numberPart)
      ? numberPart
      : inputValue;
  }

  // Empties and hide suggestion list.
  private resetSuggestions(): void {
    this.searchSuggestionsList = [];
    this.isSuggestionsVisible = false;
  }

  /**
   * Handles keyboard navigation within the search suggestions using arrow keys.
   * Updates the selected suggestion index based on keyboard input.
   * @param {KeyboardEvent} event - The keyboard event.
   * @param {number} [index] - The current index of the selected suggestion.
   * @throws {Error} When an error occurs during navigation handling.
   */
  protected handleSearchNavigationKeys(
    event: KeyboardEvent,
    index?: number
  ): void {
    try {
      if (!this.viewport) {
        return;
      }
      const currentIndex = handleSearchNavigationKeys(
        event.key,
        index ?? this.selectedSuggestionIndex,
        this.searchSuggestionsList,
        (selectedIndex) =>
          this.selectSearchSuggestion(
            this.searchSuggestionsList[selectedIndex]
          ),
        this.viewport
      );
      this.selectedSuggestionIndex = currentIndex;
    } catch (error) {
      console.error('Error handling navigation keys:', error);
    }
  }
}
