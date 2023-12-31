import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { Observable } from 'rxjs';
import { CustomMarker } from '../../Marker';
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
  constructor(
    private markerService: MarkerService,
    private filterService: FilterService
  ) {}

  // ViewChild decorator to reference the NgSelectComponent instance
  @ViewChild('openVakufNames') openVakufNames!: NgSelectComponent;
  @ViewChild('openCities') openCities!: NgSelectComponent;

  selectFilteredMarkerNames: string[] = []; //filtered markers name here

  vakufCities$?: Observable<string[]>; // data from server
  vakufObjectTypes$?: Observable<string[]>; // data from server

  // setters and getters from filter service
  set selectedVakufType(value: string) {
    this.filterService.selectedVakufType = value;
  }
  set selectedCity(value: string) {
    this.filterService.selectedCity = value;
  }
  set selectedVakufName(value: string | null) {
    this.filterService.selectedVakufName = value;
  }

  // Retrieve and set the list of vakuf cities and object types from the marker service
  ngOnInit(): void {
    this.vakufCities$ = this.markerService.getVakufCities();
    this.vakufObjectTypes$ = this.markerService.getVakufObjectTypes();
  }

  // Filter markers on the component level and share the filtered data with a service
  // Returns an array of CustomMarker objects after filtering based on the current filter criteria
  filterMarkers(): CustomMarker[] {
    return this.filterService.filterMarkers(this.markerService.markers);
  }

  // Filter marker names based on the selected vakufType and city
  // - Retrieves filtered markers from the filter service
  // - Maps the vakuf names of the filtered markers and sets them to selectFilteredMarkerNames
  // - Resets the selectedVakufName to null and triggers the overall marker filtering
  filterMarkersName(): void {
    const filteredMarkers = this.filterService.filterMarkers(
      this.markerService.markers
    );
    this.selectFilteredMarkerNames = filteredMarkers.map(
      (marker) => marker.vakufName
    );
    this.selectedVakufName = null;
    this.filterMarkers();
  }

  // triggered when a user selects vakufType to open a city dropdown
  onVakufTypeChange(): void {
    this.openCities.open();
  }

  // triggered when a user selects vakufCity to open vakuf names dropdown
  onCityChange(): void {
    this.openCities.close();
    this.openVakufNames.open();
  }
}
