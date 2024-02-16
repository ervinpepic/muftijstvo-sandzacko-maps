const MOBILE_SCREEN_WIDTH_THRESHOLD = 600;
const ZOOM_LEVEL_MOBILE = 8.1;
const ZOOM_LEVEL_DEFAULT = 9;
const ZOOM_LEVEL_THRESHOLD = 11;

/**
 * Determines the initial zoom level based on the screen width.
 * Returns a lower zoom level for mobile devices to ensure a better user experience on smaller screens.
 * @returns {number} The initial zoom level.
 */
export function getInitialZoomLevel(): number {
  const screenWidth = window.innerWidth;
  return screenWidth < MOBILE_SCREEN_WIDTH_THRESHOLD
    ? ZOOM_LEVEL_MOBILE
    : ZOOM_LEVEL_DEFAULT;
}

/**
 * Adjusts the visibility of a given polygon based on the map's zoom level.
 * @param {google.maps.Map} map The Google Maps map object.
 * @param {google.maps.Polygon} polygon The polygon whose visibility will be adjusted.
 */
export function adjustPolygonVisibilityOnZoom(
  map: google.maps.Map,
  polygon: google.maps.Polygon
): () => void {
  const listener = map.addListener('zoom_changed', () => {
    const currentZoom = map.getZoom();
    if (typeof currentZoom === 'number' && currentZoom > ZOOM_LEVEL_THRESHOLD) {
      polygon.setMap(null);
    } else {
      polygon.setMap(map);
    }
  });

  return () => google.maps.event.removeListener(listener);
}
