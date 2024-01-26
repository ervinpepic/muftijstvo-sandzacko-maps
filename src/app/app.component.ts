import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MapService } from './services/map.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule, RouterOutlet, NavbarComponent],
})
export class AppComponent implements OnInit {
  constructor(private mapService: MapService) {}
  title = 'muftijstvo-sandzacko-maps';
  @ViewChild('mapContainer', { static: true }) mapContainer?: ElementRef;

  map?: google.maps.Map; //google maps declaration

  async ngOnInit(): Promise<void> {
    await this.mapService.initializeMap(this.mapContainer!);
  }
}
