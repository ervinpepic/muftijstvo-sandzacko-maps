import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { CustomMarker } from '../interface/Marker';
import { infoWindowStyle } from '../styles/marker/info-window-style';

@Injectable({
  providedIn: 'root',
})
export class MarkerEventService {
  mapClicked: EventEmitter<void> = new EventEmitter<void>();
  private openInfoWindows: Map<google.maps.Marker, google.maps.InfoWindow> =
    new Map();

  constructor() {}

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
        this.closeOtherInfoWindows(marker);
        this.triggerMarkerBounce(marker);
        infoWindow.open(map, marker);
        map.panTo(marker.getPosition()!);
      });

      infoWindow.addListener('closeclick', () => {
        map.panTo(marker.getPosition()!);
      });

      this.handleInfoWindowImageShow(infoWindow, map);
    }
  }

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

  handleMarkerMouseHover(marker: google.maps.Marker) {
    const defaultIcon = {
      url: '../assets/images/marker_main.svg',
      scaledSize: new google.maps.Size(40, 40),
      labelOrigin: new google.maps.Point(20, -15),
    };
    const hoverIcon = {
      url: '../assets/images/marker_hover.svg',
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

  handleMapClick(map: google.maps.Map) {
    map.addListener('click', () => {
      this.mapClicked.emit();
      this.closeOtherInfoWindows();
    });
  }

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

  closeOtherInfoWindows(markerToKeepOpen?: google.maps.Marker) {
    this.openInfoWindows.forEach((infoWindow, marker) => {
      if (marker !== markerToKeepOpen) {
        infoWindow.close();
      }
    });
  }
}
