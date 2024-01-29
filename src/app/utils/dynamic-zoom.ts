// Helper method to determine the initial zoom level based on screen size
export function getInitialZoomLevel(): number {
  const screenWidth = window.innerWidth;
  if (screenWidth < 600) {
    // Mobile devices
    return 8.1;
  } else {
    // Tablets and larger screens
    return 9;
  }
}
/**
 * Listens for changes in the map's zoom level and adjusts the visibility of a polygon accordingly.
 * @param map - The Google Maps map object.
 * @param polygonName - The Google Maps polygon object whose visibility will be adjusted.
 */

export function zoomChange(
  map: google.maps.Map,
  polygonName: google.maps.Polygon
) {
  // Add a listener for the 'zoom_changed' event on the map
  map.addListener('zoom_changed', () => {
    // Check if the current zoom level is greater than 11
    if (map.getZoom()! > 11) {
      // If zoom level is greater than 11, hide the polygon by setting its map property to null
      polygonName.setMap(null);
    } else {
      // If zoom level is 11 or lower, show the polygon by setting its map property to the map
      polygonName.setMap(map);
    }
  });
}
