export function zoomChange(map: google.maps.Map, polygonName: google.maps.Polygon) {
  map.addListener('zoom_changed', () => {
    if (map.getZoom()! > 11) polygonName.setMap(null);
    else polygonName.setMap(map);
  });
}
