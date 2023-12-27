import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { Observable, combineLatest, of } from 'rxjs';
import { CustomMarker } from '../../Marker';
import { EllipsisPipe } from '../../pipes/ellipsis.pipe';
import { HighlightSearchTermPipe } from '../../pipes/highlight-search-term.pipe';
import { GenerateSuggestionsService } from '../../services/generate-suggestions.service';
import { MarkerFilterService } from '../../services/marker-filter.service';
import { MarkerService } from '../../services/marker.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  imports: [
    EllipsisPipe,
    HighlightSearchTermPipe,
    FormsModule,
    CommonModule,
    NgSelectModule,
  ],
})
export class NavbarComponent {
  constructor(
    private markerService: MarkerService,
    private searchSuggestionService: GenerateSuggestionsService,
    private markerFilterService: MarkerFilterService
  ) {}

  @ViewChild('filteredVakufNamesSelect')
  filteredVakufNamesSelect!: NgSelectComponent;
  @ViewChild('citySelect') citySelect!: NgSelectComponent;

  searchControl = new FormControl();

  // ngModel bindings
  searchQuery: string = '';
  selectedCity: string | null = null;
  selectedVakufType: string | null = null;
  filteredVakufNames: string | null = null;

  // Arrays
  markers: CustomMarker[] = [];
  selectedMarkerNames: string[] = [];
  vakufCities$?: Observable<string[]>;
  vakufObjectTypes$?: Observable<string[]>;

  // Serach suggestions bindings
  showSearchSuggestions: boolean = false;
  searchSuggestions: string[] = [];

  // error handling
  errorMessage = '';

  ngOnInit(): void {
    this.initializeData();
  }

  initializeData(): void {
    combineLatest([
      this.markerService.getVakufObjectTypes(),
      this.markerService.getVakufCities(),
    ]).subscribe({
      next: ([objectTypes, cities]) => {
        this.vakufObjectTypes$ = of(objectTypes);
        this.vakufCities$ = of(cities);
      },
      error: (error) => {
        this.errorMessage = `An error ${error} occurred while loading data. Please try again later.`;
      },
    });
  }

  // Filter markers on the map based on selected marker names from ng-select filteredVakufNames
  updateMarkersVisibility(): void {
    const filteredMarkers = this.getFilteredMarkers();
    this.markerService.markers.forEach((marker) => {
      marker.setVisible(filteredMarkers.includes(marker));
    });
  }

  // Arrow function for calling filter function
  filterMarkers(): void {
    if (
      this.selectedCity !== '' ||
      this.selectedVakufType !== '' ||
      this.searchQuery !== ''
    ) {
      this.selectedMarkerNames = this.markerService.markers
        .filter(
          (marker) =>
            (!this.selectedCity || marker.city === this.selectedCity) &&
            (!this.selectedVakufType ||
              marker.vakufType === this.selectedVakufType)
        )
        .map((marker) => marker.vakufName);
      this.filteredVakufNames = null; // clear the filteredVakufNames here
    } else {
      this.selectedMarkerNames = []; //return empty array if no result
    }
    this.updateMarkersVisibility(); // filter markers on the map
  }

  // generating suggestions based on typings
  async generateSearchSuggestions(value: string): Promise<void> {
    const filteredMarkers = this.getFilteredMarkers();
    const suggestion = await (this.searchSuggestions =
      this.searchSuggestionService.generateSearchSuggestions(
        value,
        filteredMarkers
      ));
    this.searchSuggestions = suggestion;
  }

  updateSearchQuery(value: string): void {
    const parts = value.split(' ');
    const numberPart = parts[0];

    this.searchQuery = /^\d+$/.test(numberPart) ? numberPart : value;
  }

  //selecting vakuf type when search
  selectSearchSuggestion(suggestion: string): void {
    this.updateSearchQuery(suggestion);
    this.showSearchSuggestions = false;
    this.updateMarkersVisibility();
  }

  // Method for getting forms input to show or hide suggestion
  handleSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchControl.setValue(inputElement.value);

    // check for input length
    if (inputElement.value.length > 0) {
      this.generateSearchSuggestions(inputElement.value);
      this.showSearchSuggestions = true;
    } else {
      this.showSearchSuggestions = false;
    }
    this.updateSearchQuery(inputElement.value);
  }

  private getFilteredMarkers(): CustomMarker[] {
    return this.markerFilterService.filterMarkers(
      this.markerService.markers,
      this.selectedCity || '',
      this.selectedVakufType || '',
      this.filteredVakufNames || '',
      this.searchQuery || ''
    );
  }

  onVakufTypeChange(): void {
    this.citySelect.open();
  }

  onCityChange(): void {
    this.citySelect.close();
    this.filteredVakufNamesSelect.open();
  }
}
