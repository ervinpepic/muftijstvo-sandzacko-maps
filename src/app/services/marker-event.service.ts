import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { CustomMarker } from '../interface/Marker';
import { infoWindowStyle } from '../styles/marker/info-window-style';

/**
 * Service responsible for managing events on makrers and and on Google Maps.
 * Handles a variety of events, destroys them once they are not used anymore
 */
@Injectable({
  providedIn: 'root',
})
export class MarkerEventService implements OnDestroy {
  mapClicked: EventEmitter<void> = new EventEmitter<void>();
  private openInfoWindows: Map<google.maps.Marker, google.maps.InfoWindow> =
    new Map();
  private mapClickSubscription: google.maps.MapsEventListener | null = null;

  constructor(private ngZone: NgZone) {}

  /**
   * Cleans up resources when the service is destroyed.
   * Removes the map click event listener.
   */
  ngOnDestroy() {
    // Remove the click event listener when the service is destroyed
    if (this.mapClickSubscription) {
      google.maps.event.removeListener(this.mapClickSubscription);
    }
  }

  /**
   * Handles opening an info window for a marker when clicked.
   * Also ensures only one info window is open at a time for each marker.
   * @param marker - The Google Maps Marker instance.
   * @param markerData - The data associated with the marker.
   * @param map - The Google Map instance.
   */
  handleMarkerInfoWindow(
    marker: google.maps.Marker,
    markerData: CustomMarker,
    map: google.maps.Map
  ) {
    if (!this.openInfoWindows.has(marker)) {
      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowStyle(markerData),
      });

      this.openInfoWindows.set(marker, infoWindow);

      marker.addListener('click', () => {
        this.ngZone.run(() => {
          // Wrap event listener with ngZone.run()
          this.closeOtherInfoWindows(marker);
          this.triggerMarkerBounce(marker);
          infoWindow.open(map, marker);
          map.panTo(marker.getPosition()!);
        });
      });

      infoWindow.addListener('closeclick', () => {
        this.ngZone.run(() => {
          // Wrap event listener with ngZone.run()
          map.panTo(marker.getPosition()!);
        });
      });

      this.handleInfoWindowImageShow(infoWindow, map);
    }
  }

  /**
   * Handles showing an image in the info window and toggling its visibility.
   * @param infoWindow - The Google Maps InfoWindow instance.
   * @param map - The Google Map instance.
   */
  handleInfoWindowImageShow(
    infoWindow: google.maps.InfoWindow,
    map: google.maps.Map
  ) {
    google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
      const imageToggle = document.getElementById('viewImageControlHeight');
      if (imageToggle) {
        let isCollapsed = false;
        imageToggle.addEventListener('click', () => {
          const panOffset = isCollapsed ? 150 : -150;
          map.panBy(0, panOffset);
          isCollapsed = !isCollapsed;
        });
      }
    });
  }

  /**
   * Handles changing marker icon on mouse hover.
   * @param marker - The Google Maps Marker instance.
   */
  handleMarkerMouseHover(marker: google.maps.Marker) {
    const defaultIcon = {
      url: 'assets/images/marker_main.svg',
      scaledSize: new google.maps.Size(40, 40),
      labelOrigin: new google.maps.Point(20, -15),
    };
    const hoverIcon = {
      url: 'assets/images/marker_hover.svg',
      scaledSize: new google.maps.Size(60, 60),
      labelOrigin: new google.maps.Point(40, -25),
    };

    marker.addListener('mouseover', () => {
      marker.setIcon(hoverIcon);
    });
    marker.addListener('mouseout', () => {
      marker.setIcon(defaultIcon);
    });
  }

  /**
   * Handles click event on the map.
   * Emits a mapClicked event and closes other info windows.
   * @param map - The Google Map instance.
   */
  handleMapClick(map: google.maps.Map) {
    // Add the click event listener
    this.mapClickSubscription = google.maps.event.addListener(
      map,
      'click',
      () => {
        this.ngZone.run(() => {
          // Ensure event listener runs within Angular's zone
          this.mapClicked.emit();
          this.closeOtherInfoWindows();
        });
      }
    );
  }

  /**
   * Triggers marker bounce animation.
   * @param marker - The Google Maps Marker instance.
   */
  triggerMarkerBounce(marker: google.maps.Marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => {
        marker.setAnimation(null);
      }, 2000);
    }
  }

  /**
   * Closes all info windows except the one associated with the markerToKeepOpen.
   * @param markerToKeepOpen - Optional. The marker whose info window should remain open.
   */
  closeOtherInfoWindows(markerToKeepOpen?: google.maps.Marker) {
    this.openInfoWindows.forEach((infoWindow, marker) => {
      if (marker !== markerToKeepOpen) {
        infoWindow.close();
      }
    });
  }
}
