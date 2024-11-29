import { Marker } from '../../interface/Marker';
import { infoWindowStyle } from './info-window-style';

export function addMarkerHoverEffect(
  marker: google.maps.marker.AdvancedMarkerElement,
  svgImageElement: HTMLImageElement
) {
  marker.content?.addEventListener('mouseover', () => {
    svgImageElement.src = '../assets/images/marker_hover.svg';
    svgImageElement.style.transform = 'scale(1.5)';
    svgImageElement.style.transition = 'transform 0.3s ease';
  });

  marker.content?.addEventListener('mouseout', () => {
    svgImageElement.src = '../assets/images/marker_main.svg';
    svgImageElement.style.transform = 'scale(1)';
  });
}

export function addMarkerClickListener(
  marker: google.maps.marker.AdvancedMarkerElement,
  map: google.maps.Map,
  markerData: Marker,
  infoWindow: google.maps.InfoWindow | undefined
) {
  marker.addListener('click', () => {
    // Close the previous info window if needed
    if (infoWindow) {
      infoWindow.close();
    }

    // Create and open the new info window
    const newInfoWindow = new google.maps.InfoWindow({
      content: infoWindowStyle(markerData),
    });

    newInfoWindow.open({
      anchor: marker,
      map: map,
    });

    // Optionally update the reference to the currently open info window
    infoWindow = newInfoWindow;
    // Add event listener for when the InfoWindow is closed
    newInfoWindow.addListener('closeclick', () => {
      // Slightly zoom out the map
      const currentZoom = map.getZoom() || 15; // Default to 15 if no zoom level is available
      map.setZoom(currentZoom - 0.5);
    });
  });
}
