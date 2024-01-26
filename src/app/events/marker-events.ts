import { CustomMarker } from '../interface/Marker';
import { infoWindowStyle } from '../styles/marker/info-window-style';
import { MarkerStyle } from '../styles/marker/marker-style';

export class MarkerEvent {
  private openInfoWindow: google.maps.InfoWindow | null = null;
  private readonly infoWindowStyle = infoWindowStyle;

  private readonly markerStyler = new MarkerStyle();
  // Handles the click event on a marker to show its info window
  handleMarkerInfoWindow(
    marker: google.maps.Marker,
    markerData: CustomMarker,
    map: google.maps.Map
  ) {
    const infoWindow = new google.maps.InfoWindow();
    marker.addListener('click', () => {
      this.closeOtherInfoWindows();
      this.triggerMarkerBounce(marker);

      infoWindow.setContent(this.infoWindowStyle(markerData));
      infoWindow.open(map, marker);
      this.openInfoWindow = infoWindow;
      map.panTo(marker.getPosition()!);
    });

    infoWindow.addListener('closeclick', () => {
      map.panTo(marker.getPosition()!);
    });

    map.addListener('click', () => {
      infoWindow.close();
    });
    let panOffset = -150;
    // Add event listener to the "Prikaži sliku parcele" link
    google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
      const imageToggle = document.getElementById('viewImageControlHeight');
      if (imageToggle) {
        imageToggle.addEventListener('click', () => {
          // Pan the map by the current offset by px
          map.panBy(0, panOffset);
          // Toggle the pan offset for the next click
          panOffset = -panOffset;
        });
      }
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
  closeOtherInfoWindows() {
    if (this.openInfoWindow) {
      this.openInfoWindow.close();
      this.openInfoWindow = null;
    }
  }
}
