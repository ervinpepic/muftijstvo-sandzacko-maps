export class MarkerStyle {
  createDefaultMarkerIcon(): google.maps.Icon {
    return {
      url: '../assets/images/marker_main.svg',
      scaledSize: new google.maps.Size(40, 40),
      labelOrigin: new google.maps.Point(20, -15),
    };
  }

  applyDefaultMarkerIcon(marker: google.maps.Marker): void {
    marker.setIcon(this.createDefaultMarkerIcon());
  }

  applyLargeMarkerIcon(marker: google.maps.Marker): void {
    marker.setIcon({
      url: '../assets/images/marker_hover.svg',
      scaledSize: new google.maps.Size(60, 60),
      labelOrigin: new google.maps.Point(40, -25),
    });
  }

  onMarkerMouseOver(marker: google.maps.Marker): void {
    this.applyLargeMarkerIcon(marker);
  }

  onMarkerMouseOut(marker: google.maps.Marker): void {
    this.applyDefaultMarkerIcon(marker);
  }
}
