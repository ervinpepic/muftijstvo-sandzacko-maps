import { Marker } from '../../interface/Marker';
import { infoWindowStyle } from './info-window-style';

let infoWindow: google.maps.InfoWindow | undefined = undefined;

export function markerHoverEffect(
  marker: google.maps.marker.AdvancedMarkerElement,
  svgImageElement: HTMLImageElement
) {
  marker.content?.addEventListener('mouseover', () => {
    svgImageElement.src = '../assets/marker_hover.svg';
    svgImageElement.style.transform = 'scale(1.5)';
    svgImageElement.style.transition = 'transform 0.3s ease';
  });

  marker.content?.addEventListener('mouseout', () => {
    svgImageElement.src = '../assets/marker_main.svg';
    svgImageElement.style.transform = 'scale(1.3)';
  });
}

export function markerClickListener(
  marker: google.maps.marker.AdvancedMarkerElement,
  map: google.maps.Map,
  markerData: Marker,
) {
  marker.addListener('click', () => {
    if (infoWindow) {
      infoWindow.close();
    }
    infoWindow = new google.maps.InfoWindow({
      content: infoWindowStyle(markerData),
    });

    infoWindow.open({
      anchor: marker,
      map: map,
    });
    infoWindow.addListener('closeclick', () => {
      const currentZoom = map.getZoom()!;
      map.setZoom(currentZoom - 0.5);
    });
  });
}