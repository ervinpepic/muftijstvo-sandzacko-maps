import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MapService } from './services/map.service';
import { MarkerService } from './services/marker.service';

declare const bootstrap: any;

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule, RouterOutlet, NavbarComponent],
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(
    private mapService: MapService,
    private markerService: MarkerService
  ) {}
  title = 'Muftijstvo Sandzacko mapa vakufa';
  vakufCounter: number = 0;
  @ViewChild('mapContainer', { static: true }) mapContainer?: ElementRef;

  async ngOnInit(): Promise<void> {
    await this.mapService.initializeMap(this.mapContainer!);
    await this.getMarkersNumber(); // Fetch markers and update vakufCounter in ngOnInit
  }

  initializePopovers(): void {
    let popoverTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="popover"]')
    );
    popoverTriggerList.map((popoverTriggerEl: HTMLElement) => {
      return new bootstrap.Popover(popoverTriggerEl);
    });
  }
  async getMarkersNumber(): Promise<void> {
    const markers = await this.markerService.getMarkers();
    this.vakufCounter = markers.length;
    this.initializePopovers();
  }

  ngAfterViewInit(): void {
    this.getMarkersNumber().then(() => {
      this.initializePopovers(); // Initialize popovers after fetching markers
    });
  }
}
