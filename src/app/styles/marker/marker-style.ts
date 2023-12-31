export class MarkerStyle {
  // Create the default marker icon
  createDefaultMarkerIcon(): google.maps.Icon {
    return {
      url: '../assets/images/marker_main.svg',
      scaledSize: new google.maps.Size(40, 40),
      labelOrigin: new google.maps.Point(20, -15),
    };
  }

  // Apply the default marker icon to a given marker
  applyDefaultMarkerIcon(marker: google.maps.Marker): void {
    marker.setIcon(this.createDefaultMarkerIcon());
  }

  // Apply a large marker icon (on mouse over) to a given marker
  applyLargeMarkerIcon(marker: google.maps.Marker): void {
    marker.setIcon({
      url: '../assets/images/marker_hover.svg',
      scaledSize: new google.maps.Size(60, 60),
      labelOrigin: new google.maps.Point(40, -25),
    });
  }

  // Event handler for marker mouse over: apply large marker icon
  onMarkerMouseOver(marker: google.maps.Marker): void {
    this.applyLargeMarkerIcon(marker);
  }

  // Event handler for marker mouse out: revert to default marker icon
  onMarkerMouseOut(marker: google.maps.Marker): void {
    this.applyDefaultMarkerIcon(marker);
  }
}
