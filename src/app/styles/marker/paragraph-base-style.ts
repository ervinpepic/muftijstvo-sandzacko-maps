import { Marker } from '../../interface/Marker';
/**
 * Class string defining the style for paragraph titles within the info window.
 * Includes text size, alignment, and font weight.
 */
export const paragraphTitleClass = 'fs-6 text-center text-nowrap fw-light';

/**
 * Class string defining the style for paragraph content within the info window.
 * Includes text size, alignment, word wrapping, and font weight.
 */
export const paragraphContentClass = 'fs-6 text-center word-wrap fw-normal';

/**
 * Class string for styling links within the info window.
 * Includes success color, offset adjustments, hover behavior, and underline effects.
 */
export const linkSuccess =
  'link-success link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover';

/**
 * Generates HTML string for a paragraph element, incorporating an icon, title, and content.
 *
 * @param {string} icon - The name of the material icon to be displayed.
 * @param {string} title - The title text of the paragraph.
 * @param {string} content - The content of the paragraph.
 * @returns {string} The HTML string for the paragraph element.
 */
export const createParagraphHTML = (
  icon: string,
  title: string,
  content: string
) =>
  `<p
    title='Prikazuje ${title} vakufa' 
    class='${paragraphTitleClass}'>
    <span class='material-symbols-outlined'>${icon}</span> ${title}
    <span class='d-block ${paragraphContentClass}'>
      ${content}
    </span>
  </p>`;

/**
 * Constructs an array of paragraph detail objects for a given marker.
 * Each object contains an icon, title, and content to be used in creating HTML paragraphs.
 *
 * @param {Marker} marker - The marker data used to generate paragraph details.
 * @returns {Array<Object>} An array of objects where each object represents details for a paragraph.
 */
export const getParagraphDetails = (marker: Marker) => [
  {
    icon: 'calendar_month',
    title: marker.vakufType === 'Džamija' ? 'Izgrađena: ' : 'Uvakufljeno: ',
    content:
      marker.yearFounded != '' ? `${marker.yearFounded}. god.` : 'Nema datum',
  },
  {
    icon: 'map',
    title: 'Katastarska parcela: ',
    content: marker.cadastralParcelNumber,
  },
  {
    icon: 'contract',
    title: 'List nepokretnosti: ',
    content: marker.realEstateNumber,
  },
  {
    icon: 'area_chart',
    title: 'Površina parcele: ',
    content: `${marker.areaSize}m<sup>2</sup>`,
  },
  {
    icon: 'location_city',
    title: 'Katastarska opština: ',
    content: marker.cadastralMunicipality,
  },
  {
    icon: 'signpost',
    title: 'Ulica | Potes: ',
    content: marker.streetName,
  },
];
