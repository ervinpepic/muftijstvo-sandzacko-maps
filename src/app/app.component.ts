import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MapService } from './services/map.service';
import { MarkerService } from './services/marker.service';

declare var bootstrap: any; // Declare Bootstrap as any to avoid TypeScript errors

/**
 * The main component for the application, responsible for initializing the map and managing markers. This component 
 * handles the lifecycle of the map and its associated services, including the initialization of map services, 
 * counting the number of vakufs (markers), and managing UI components like popovers that provide additional 
 * information to the user.
 *
 * The component uses Angular's lifecycle hooks to initialize the map, set up markers, and clean up resources. It 
 * leverages services for map and marker operations, demonstrating how to integrate asynchronous data fetching 
 * within Angular's component lifecycle.
 *
 * Properties:
 * - title: The title of the application, used here for display purposes or as a document title.
 * - vakufCounter: A counter for the total number of vakufs (markers) displayed on the map.
 *
 * Methods:
 * - ngOnInit: Asynchronously initializes the map with markers upon component initialization.
 * - ngOnDestroy: Cleans up resources, specifically disposing of the bootstrap popover instance, to prevent memory 
 *                leaks.
 * - ngAfterViewInit: Initializes a bootstrap popover for a UI element after the view has fully initialized. This 
 *                    popover displays the current count of vakufs.
 * - getMarkersNumber: Fetches the number of markers from the `MarkerService` and updates `vakufCounter` with the 
 *                     total count.
 *
 * @remarks
 * This component requires the presence of the `MapService` and `MarkerService` to function correctly, as these 
 * services are essential for map initialization and marker management. The component also demonstrates handling 
 * of dynamic UI elements like popovers in an Angular context.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule, NavbarComponent],
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(
    private mapService: MapService,
    private markerService: MarkerService
  ) {}
  title = 'Muftijstvo Sandzacko mapa vakufa';

  @ViewChild('mapContainer', { static: true }) mapContainer?: ElementRef;
  @ViewChild('popoverButton') popoverButton!: ElementRef;

  async ngOnInit(): Promise<void> {
    await this.mapService.initializeMap(this.mapContainer!);
  }

  ngOnDestroy(): void {
    const popoverInstance = bootstrap.Popover.getInstance(
      this.popoverButton.nativeElement
    );
    if (popoverInstance) {
      popoverInstance.dispose();
    }
  }

  ngAfterViewInit(): void {
    new bootstrap.Popover(this.popoverButton.nativeElement, {
      container: 'body',
      content: () => `Trenutno upisano ${this.markerService.markersNumber} vakufa.`,
      trigger: 'click',
      placement: 'bottom',
    });
  }
}
