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
  @ViewChild('openVakufNames') openVakufNames!: NgSelectComponent;
  @ViewChild('openCities') openCities!: NgSelectComponent;

  set selectedVakufType(value: string) {
    this.filterService.selectedVakufType = value;
  }
  set selectedCity(value: string) {
    this.filterService.selectedCity = value;
  }
  set selectedVakufNames(value: string | null) {
    this.filterService.selectedVakufNames = value;
  }
  // Arrays
  markers: CustomMarker[] = [];
  selectFilteredMarkerNames: string[] = [];
  vakufCities$?: Observable<string[]>;
  vakufObjectTypes$?: Observable<string[]>;

  ngOnInit(): void {
    this.vakufCities$ = this.markerService.getVakufCities();
    this.vakufObjectTypes$ = this.markerService.getVakufObjectTypes();
  }

  private getFilteredMarkers(): CustomMarker[] {
    return this.filterService.filterMarkers(this.markerService.markers);
  }

  filterMarkers(): void {
    const filteredMarkers = this.filterService.filterMarkers(this.markerService.markers);
    this.selectFilteredMarkerNames = filteredMarkers.map((marker) => marker.vakufName);
    this.selectedVakufNames = null;
    this.updateMarkersVisibility();
  }

  onVakufTypeChange(): void {
    this.openCities.open();
  }

  onCityChange(): void {
    this.openCities.close();
    this.openVakufNames.open();
  }

  updateMarkersVisibility(): void {
    const filteredMarkers = this.getFilteredMarkers();
    this.markerService.updateMarkersVisibility(filteredMarkers);
  }
}
