import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { VakufMarkerDetails } from '../interface/Marker';
import { infoWindowStyle } from '../styles/marker/info-window-style';

/**
 * Service responsible for managing events on makrers and and on Google Maps.
 * Handles a variety of events, destroys them once they are not used anymore
 */
@Injectable({
  providedIn: 'root',
})
export class MarkerEventService implements OnDestroy {
  private readonly defaultIconUrl = 'assets/images/marker_main.svg';
  private readonly hoverIconUrl = 'assets/images/marker_hover.svg';

  get defaultIcon() {
    return {
      url: this.defaultIconUrl,
      scaledSize: new google.maps.Size(40, 40),
      labelOrigin: new google.maps.Point(20, -15),
    };
  }

  get hoverIcon() {
    return {
      url: this.hoverIconUrl,
      scaledSize: new google.maps.Size(60, 60),
      labelOrigin: new google.maps.Point(40, -25),
    };
  }

  mapClicked: EventEmitter<void> = new EventEmitter<void>();
  private openInfoWindows: Map<google.maps.Marker, google.maps.InfoWindow> =
    new Map();
  private subscriptions: google.maps.MapsEventListener[] = []; // Store all subscriptions
  private mapClickSubscription: google.maps.MapsEventListener | null = null;

  constructor(private ngZone: NgZone) {}

  /**
   * Cleans up resources when the service is destroyed.
   * Removes the map click event listener.
   */
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => google.maps.event.removeListener(sub));
    this.subscriptions = []; // Clear the subscriptions array
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
    markerData: VakufMarkerDetails,
    map: google.maps.Map
  ) {
    if (!this.openInfoWindows.has(marker)) {
      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowStyle(markerData),
      });
      this.openInfoWindows.set(marker, infoWindow);

      // Store marker click listener to manage its lifecycle
      const markerClickListener = marker.addListener('click', () =>
        this.ngZone.run(() => {
          this.closeOtherInfoWindows(marker);
          this.triggerMarkerBounce(marker);
          infoWindow.open(map, marker);
          map.panTo(marker.getPosition()!);
        })
      );
      this.subscriptions.push(markerClickListener);

      const infoWindowCloseListener = infoWindow.addListener('closeclick', () =>
        this.ngZone.run(() => {
          map.panTo(marker.getPosition()!);
        })
      );
      this.subscriptions.push(infoWindowCloseListener);

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
    marker.addListener('mouseover', () => {
      marker.setIcon(this.hoverIcon);
    });
    marker.addListener('mouseout', () => {
      marker.setIcon(this.defaultIcon);
    });
  }

  /**
   * Handles click event on the map.
   * Emits a mapClicked event and closes other info windows.
   * @param map - The Google Map instance.
   */
  handleMapClick(map: google.maps.Map) {
    if (this.mapClickSubscription) {
      google.maps.event.removeListener(this.mapClickSubscription);
      this.mapClickSubscription = null;
    }
    this.mapClickSubscription = map.addListener('click', () =>
      this.ngZone.run(() => {
        this.mapClicked.emit();
        this.closeOtherInfoWindows();
      })
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
