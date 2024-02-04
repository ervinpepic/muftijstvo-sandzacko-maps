import { Renderer } from '@googlemaps/markerclusterer';

const hexToRgb = (hex: string) => {
  // Remove '#' from the beginning of the hex code
  hex = hex.replace(/^#/, '');

  // Parse the hex code into individual color components
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Return an object containing the RGB components
  return { r, g, b };
};

const interpolateColor = (
  startColor: string,
  endColor: string,
  count: number,
  totalCount: number
) => {
  const startRGB = hexToRgb(startColor);
  const endRGB = hexToRgb(endColor);

  const ratio = count / totalCount;
  const threshold = 0.2; // Adjust this threshold as needed

  // Interpolate linearly up to the threshold, then use the end color
  const r =
    ratio < threshold
      ? Math.round(startRGB.r + ((endRGB.r - startRGB.r) * ratio) / threshold)
      : endRGB.r;
  const g =
    ratio < threshold
      ? Math.round(startRGB.g + ((endRGB.g - startRGB.g) * ratio) / threshold)
      : endRGB.g;
  const b =
    ratio < threshold
      ? Math.round(startRGB.b + ((endRGB.b - startRGB.b) * ratio) / threshold)
      : endRGB.b;

  return `rgb(${r}, ${g}, ${b})`;
};
// define custom render for marker clusterer
export const render: Renderer = {
  render: ({ count, position }, stats) => {
    const color = interpolateColor(
      '#52a77a',
      '#b6a37c',
      count,
      stats.clusters.markers.max
    );

    const svg = btoa(`
            <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 568.6 568.6">
              <g id="Layer_1-2" data-name="Layer 1">
                <g style="opacity: .2;">
                  <path d="M284.3,0l83.26,83.26h117.78v117.78l83.26,83.26-83.26,83.26v117.78h-117.78l-83.26,83.26-83.26-83.26H83.26v-117.78L0,284.3l83.26-83.26V83.26h117.78L284.3,0Z" style="fill: ${color}; fill-rule: evenodd;"/>
                </g>
                <g style="opacity: .4;">
                  <path d="M284.3,23l76.49,76.49h108.22v108.22l76.49,76.49-76.49,76.49v108.22h-108.22l-76.49,76.49-76.49-76.49H99.59v-108.22L23.1,284.2l76.49-76.49V99.49h108.22L284.3,23h0Z" style="fill: ${color}; fill-rule: evenodd;"/>
                </g>
                <path d="M284.3,49.3l68.8,68.8h97.3v97.3l68.8,68.8-68.8,68.8v97.3h-97.3l-68.8,68.8-68.8-68.8H118.2v-97.3l-68.8-68.8,68.8-68.8V118.1h97.3l68.8-68.8h0Z" style="fill: ${color}; fill-rule: evenodd;"/>
              </g>
            </svg>
          `);
    return new google.maps.Marker({
      icon: {
        url: `data:image/svg+xml;base64,${svg}`,
        scaledSize: new google.maps.Size(50, 50),
      },
      label: { text: String(count), color: '#FFFFFF', fontSize: '12px' },
      position,
      zIndex: google.maps.Marker.MAX_ZINDEX + count,
    });
  },
};
