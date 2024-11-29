import { Cluster, Renderer } from '@googlemaps/markerclusterer';

/**
 * Converts a hexadecimal color code to its RGB representation.
 *
 * @param {string} hex - The hexadecimal color code, with or without the leading '#'.
 * @returns {{r: number, g: number, b: number}} An object containing the RGB components of the color.
 */
const hexToRgb = (hex: string) => {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
};

/**
 * Interpolates between two colors based on the given ratio and applies a linear threshold.
 *
 * @param {string} startColor - The starting color in hexadecimal format.
 * @param {string} endColor - The ending color in hexadecimal format.
 * @param {number} count - The current count, used to determine the interpolation ratio.
 * @param {number} totalCount - The total count, used with `count` to calculate the interpolation ratio.
 * @returns {string} The interpolated color in 'rgb(r, g, b)' format.
 */
const interpolateColor = (
  startColor: string,
  endColor: string,
  count: number,
  totalCount: number
) => {
  const startRGB = hexToRgb(startColor);
  const endRGB = hexToRgb(endColor);

  const ratio = count / totalCount;
  const threshold = 0.2;

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

/**
 * Custom renderer function for Google Maps MarkerClusterer that uses an SVG icon.
 * The icon color changes based on the cluster's marker count, interpolating between two colors.
 *
 * @param {object} params - The parameters provided by MarkerClusterer, including count and position.
 * @param {object} stats - Additional statistics provided by MarkerClusterer, used to calculate color interpolation.
 * @returns {google.maps.marker.AdvancedMarkerElement} An instance of AdvancedMarkerElement with a custom SVG icon.
 */
export const render: Renderer = {
  render: ({ count, position }: Cluster) => {
    const maxCount = 100;

    // Calculate the color based on the count and the maximum count
    const color = interpolateColor('#52a77a', '#b6a37c', count, maxCount);

    // Create the cluster element
    const clusterElement = document.createElement('div');
    clusterElement.style.position = 'relative';
    clusterElement.style.width = '50px';
    clusterElement.style.height = '50px';

    // Set the zIndex directly on the element's style to control layer ordering
    clusterElement.style.zIndex = `${count}`;

    // Create the SVG element with dynamic color
    const svgElement = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 568.6 568.6" width="50" height="50">
          <g style="opacity: .2;">
            <path d="M284.3,0l83.26,83.26h117.78v117.78l83.26,83.26-83.26,83.26v117.78h-117.78l-83.26,83.26-83.26-83.26H83.26v-117.78L0,284.3l83.26-83.26V83.26h117.78L284.3,0Z" style="fill: ${color}; fill-rule: evenodd;"/>
          </g>
          <g style="opacity: .4;">
            <path d="M284.3,23l76.49,76.49h108.22v108.22l76.49,76.49-76.49,76.49v108.22h-108.22l-76.49,76.49-76.49-76.49H99.59v-108.22L23.1,284.2l76.49-76.49V99.49h108.22L284.3,23Z" style="fill: ${color}; fill-rule: evenodd;"/>
          </g>
          <path d="M284.3,49.3l68.8,68.8h97.3v97.3l68.8,68.8-68.8,68.8v97.3h-97.3l-68.8,68.8-68.8-68.8H118.2v-97.3l-68.8-68.8,68.8-68.8V118.1h97.3l68.8-68.8Z" style="fill: ${color}; fill-rule: evenodd;"/>
        </svg>
      `;

    // Set the inner HTML of the cluster element to the SVG
    clusterElement.innerHTML = svgElement;

    // Create a label div to display the count
    const labelDiv = document.createElement('div');
    labelDiv.style.position = 'absolute';
    labelDiv.style.top = '0';
    labelDiv.style.left = '0';
    labelDiv.style.width = '50px';
    labelDiv.style.height = '50px';
    labelDiv.style.display = 'flex';
    labelDiv.style.alignItems = 'center';
    labelDiv.style.justifyContent = 'center';
    labelDiv.style.color = '#FFFFFF';
    labelDiv.style.fontSize = '12px';
    labelDiv.style.fontWeight = 'bold';
    labelDiv.textContent = String(count);

    // Append the label to the cluster element
    clusterElement.appendChild(labelDiv);

    // Create and return the AdvancedMarkerElement
    return new google.maps.marker.AdvancedMarkerElement({
      position,
      map: undefined, // Let the MarkerClusterer manage the map assignment
      content: clusterElement,
    });
  },
};
