import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { EllipsisPipe } from '../../pipes/ellipsis.pipe';
import { FilterService } from '../../services/filter.service';
import { MarkerService } from '../../services/marker.service';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [NgSelectModule, FormsModule, CommonModule, EllipsisPipe],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
})
export class SelectComponent implements OnInit {
  filteredMarkerNames: string[] = []; // An array to store the names of filtered markers.
  filteredMarkers: google.maps.Marker[] = []; //An array to store filtered markers.
  vakufObjectTypes?: string[]; // A list of object types received from the server.
  vakufCities?: string[]; // A list of cities received from the server.

  //References the NgSelectComponent instance for vakuf names and cities.
  @ViewChild('openVakufNames') openVakufNames!: NgSelectComponent;
  @ViewChild('openCities') openCities!: NgSelectComponent;

  // Setters to upodate these properties  in the filter service.
  set selectedVakufType(value: string) {
    this.filterService.selectedVakufType = value;
  }

  set selectedCity(value: string) {
    this.filterService.selectedCity = value;
  }

  set selectedVakufName(value: string | null) {
    this.filterService.selectedVakufName = value;
  }

  /**
   * Constructs the SelectComponent.
   * @param markerService - Provides marker related functionalities.
   * @param filterService - Provides filtering capabilities.
   */
  constructor(
    private markerService: MarkerService,
    private filterService: FilterService
  ) { }

  // Initializes the component by fetching and setting the lists of vakuf cities and object types.
  ngOnInit(): void {
    try {
      this.vakufCities = this.markerService.getVakufCities();
      this.vakufObjectTypes = this.markerService.getVakufObjectTypes();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  /**
   * Filters markers at the component level and updates the filteredMarkers property.
   * Catches and logs any errors that occur during the filtering process.
   */
  protected filterMarkers(): void {
    try {
      this.filteredMarkers = this.filterService.filterMarkers(this.markerService.markers);
    } catch (error) {
      console.error('Error filtering markers:', error);
    }
  }

  /**
   * Filters marker names based on the selected vakuf type and city.
   * Resets the selected vakuf name to trigger overall marker filtering.
   */
  protected filterMarkersNames(): void {
    this.filterMarkers();
    this.filteredMarkerNames = this.filteredMarkers.map(marker => {
      // Retrieve the custom data associated with the marker
      const customData = this.markerService.markerDataMap.get(marker);
      // Return the vakufName if customData is found, otherwise return null
      return customData ? customData.vakufName : null;
    })
      .filter((name): name is string => name !== null); // Use a type guard to filter out null values

    this.selectedVakufName = null;
  }

  /**
   * Opens the city dropdown when a vakuf type is selected.
   */
  protected handleVakufTypeChange(): void {
    this.openCities.open();
  }

  /**
   * Closes the city dropdown and opens the vakuf names dropdown when a city is selected.
   */
  protected handleCityChange(): void {
    this.openCities.close();
    this.openVakufNames.open();
  }
}