import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { EllipsisPipe } from '../../pipes/ellipsis.pipe';
import { FilterService } from '../../services/filter.service';
import { MarkerService } from '../../services/marker.service';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [NgSelectModule, FormsModule, CommonModule, EllipsisPipe],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
})
export class SelectComponent implements OnInit {
  //References the NgSelectComponent instance for vakuf names and cities.
  @ViewChild('openVakufNames') openVakufNames!: NgSelectComponent;
  @ViewChild('openCities') openCities!: NgSelectComponent;

  protected filteredMarkersNames: string[] = []; // An array to store the names of filtered markers.
  private filteredMarkers: google.maps.marker.AdvancedMarkerElement[] = []; // An array to store filtered markers.
  protected vakufObjectTypes?: string[]; // A list of object types received from the server.
  protected vakufCities?: string[]; // A list of cities received from the server.

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
    private filterService: FilterService, 
    private mapService: MapService
  ) { }

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
      console.warn('Error filtering markers:', error);
    }
  }

  /**
   * Filters marker names based on the selected vakuf type and city.
   * Retrieve the custom data associated with the marker
   * Return the vakufName if customData is found, otherwise return null
   * Resets the selected vakuf name to trigger overall marker filtering.
   */
  protected filterMarkersNames(): void {
    if (
      this.selectedVakufType === '' && 
      this.selectedCity === '' &&
      this.selectedVakufName === ''
    ) {
      this.filterService.resetMarkers(this.markerService.markers);
      this.filteredMarkersNames = [];
      this.selectedVakufName = null;
      return;
    }

    this.filterMarkers();
  
    this.filteredMarkersNames = this.filteredMarkers.map(marker => {
      const customData = this.markerService.markerDataMap.get(marker);
      return customData ? customData.vakufName : null;
    }).filter((name): name is string => name !== null);
  
    this.selectedVakufName = null;

    this.updateMapMarkers();
  }
  
  protected updateMapMarkers(): void {
    try {
      const filteredSet = new Set(this.filteredMarkers);
      this.markerService.markers.forEach(marker => {
        if (!filteredSet.has(marker)) {
          marker.map = null;
        }
      });
  
      this.filteredMarkers.forEach(marker => {
        marker.map = this.mapService.map;
      });
    } catch (error) {
      console.warn('Error updating markers on map:', error);
    }
  }
  

  /**
   * Opens the city dropdown when a vakuf type is selected.
   */
  protected handleVakufTypeChange(): void {
    if (this.openVakufNames.isOpen) {
      this.openVakufNames.close();
    }
    this.openCities.open();
  }

  /**
   * Closes the city dropdown and opens the vakuf names dropdown when a city is selected.
   */
  protected handleCityChange(): void {
    if (this.openCities.isOpen) {
      this.openCities.close();
    }
    this.openVakufNames.open();
  }
}