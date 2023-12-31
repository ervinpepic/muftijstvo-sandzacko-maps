import { CustomMarker } from '../Marker';
import { infoWindowStyle } from '../styles/marker/info-window-style';
import { MarkerStyle } from '../styles/marker/marker-style';

export class MarkerEvent {
  private openInfoWindow: google.maps.InfoWindow[] = [];
  private readonly infoWindowStyle = infoWindowStyle;

  private readonly markerStyler = new MarkerStyle();

  // Handles the click event on a marker to show its info window
  handleMarkerInfoWindow(
    marker: any,
    markerData: CustomMarker,
    map: google.maps.Map
  ) {
    const infoWindow = new google.maps.InfoWindow();
    marker.addListener('click', () => {
      this.closeOtherInfoWindows();
      this.triggerMarkerBounce(marker);

      infoWindow.setContent(this.infoWindowStyle(markerData));
      infoWindow.open(map, marker);
      this.openInfoWindow[0] = infoWindow;
      map.panTo(marker.getPosition()!);
    });

    infoWindow.addListener('closeclick', () => {
      map.panTo(marker.getPosition());
      map.setZoom(map.getZoom()! - 0.5);
    });

    map.addListener('click', () => {
      infoWindow.close();
      marker.open = false;
      map.setZoom(map.getZoom()! - 0.9 / 1.8);
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
    if (this.openInfoWindow.length > 0) {
      // detach the info window from the marker undocumented in google API
      this.openInfoWindow[0].set('marker', null);
      // close it
      this.openInfoWindow[0].close();
      // blank the array
      this.openInfoWindow.length = 0;
    }
  }
}
