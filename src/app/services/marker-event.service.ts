import { EventEmitter, Injectable } from '@angular/core';
import { CustomMarker } from '../interface/Marker';
import { infoWindowStyle } from '../styles/marker/info-window-style';
import { MarkerStyle } from '../styles/marker/marker-style';

@Injectable({
  providedIn: 'root',
})
export class MarkerEventService {
  constructor() {}

  private readonly infoWindowStyle = infoWindowStyle;
  private readonly markerStyler = new MarkerStyle();
  mapClicked: EventEmitter<void> = new EventEmitter<void>();

  private openInfoWindows: Map<google.maps.Marker, google.maps.InfoWindow> =
    new Map();

  // Handles the click event on a marker to show its info window
  handleMarkerInfoWindow(
    marker: google.maps.Marker,
    markerData: CustomMarker,
    map: google.maps.Map
  ) {
    const infoWindow = new google.maps.InfoWindow({
      content: this.infoWindowStyle(markerData),
    });
    this.openInfoWindows.set(marker, infoWindow);

    marker.addListener('click', () => {
      this.closeOtherInfoWindows(marker);
      this.triggerMarkerBounce(marker);

      infoWindow.open(map, marker);
      map.panTo(marker.getPosition()!);
    });

    infoWindow.addListener('closeclick', () => {
      map.panTo(marker.getPosition()!);
    });
    // Add event listener to the "Prikaži sliku parcele" link
    this.handleInfoWindowImageShow(infoWindow, map);
  }

  handleInfoWindowImageShow(
    infoWindow: google.maps.InfoWindow,
    map: google.maps.Map
  ) {
    google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
      const imageToggle = document.getElementById('viewImageControlHeight');
      if (imageToggle) {
        let isCollapsed = false; // Variable to track toggle state
        imageToggle.addEventListener('click', () => {
          let panOffset = -150; // Default panOffset value

          // Adjust panOffset based on toggle state
          if (isCollapsed) {
            panOffset = 150; // Increase panOffset
          } else {
            panOffset = -150; // Reset panOffset to its default value
          }

          map.panBy(0, panOffset);
          isCollapsed = !isCollapsed; // Toggle the state
        });
      }
    });
  }

  handleMapClick(map: google.maps.Map) {
    map.addListener('click', () => {
      this.mapClicked.emit();
      this.closeOtherInfoWindows();
    });
  }

  // Handles the mouseover event on a marker to change its style
  handleMarkerMouseOver(marker: any) {
    marker.addListener('mouseover', () => {
      this.markerStyler.onMarkerMouseOver(marker);
    });
  }

  // Handles the mouseout event on a marker to revert its style
  handleMarkerMouseOut(marker: any) {
    marker.addListener('mouseout', () => {
      this.markerStyler.onMarkerMouseOut(marker);
    });
  }

  // Triggers a bounce animation on a marker
  triggerMarkerBounce(marker: any) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function () {
        marker.setAnimation(null);
      }, 2000); // current maps duration of one bounce (v3.13)
    }
  }

  // Closes other open info windows on the map
  closeOtherInfoWindows(markerToKeepOpen?: google.maps.Marker) {
    this.openInfoWindows.forEach((infoWindow, marker) => {
      if (marker !== markerToKeepOpen) {
        infoWindow.close();
      }
    });
  }
}
