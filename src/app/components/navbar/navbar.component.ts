import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { Observable } from 'rxjs';
import { CustomMarker } from '../../Marker';
import { EllipsisPipe } from '../../pipes/ellipsis.pipe';
import { FilterService } from '../../services/filter.service';
import { MarkerService } from '../../services/marker.service';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  imports: [
    EllipsisPipe,
    FormsModule,
    CommonModule,
    NgSelectModule,
    SearchComponent,
  ],
})
export class NavbarComponent {
  constructor(
    private markerService: MarkerService,
    private filterService: FilterService
  ) {}

  @ViewChild('openVakufNames') openVakufNames!: NgSelectComponent;
  @ViewChild('openCities') openCities!: NgSelectComponent;

  // ngModels
  searchQuery: string = '';
  selectedCity: string | null = null;
  selectedVakufType: string | null = null;
  selectedVakufNames: string | null = null;

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
    return this.filterService.filterMarkers(
      this.markerService.markers,
      this.selectedCity || '',
      this.selectedVakufType || '',
      this.selectedVakufNames || '',
      this.searchQuery || ''
    );
  }

  filterMarkers(): void {
    if (
      this.selectedCity !== '' ||
      this.selectedVakufType !== '' ||
      this.searchQuery !== ''
    ) {
      this.selectFilteredMarkerNames = this.markerService.markers
        .filter(
          (marker) =>
            (!this.selectedCity || marker.city === this.selectedCity) &&
            (!this.selectedVakufType ||
              marker.vakufType === this.selectedVakufType)
        )
        .map((marker) => marker.vakufName);
      this.selectedVakufNames = null;
    } else {
      this.selectFilteredMarkerNames = [];
    }
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
