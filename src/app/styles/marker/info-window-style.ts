import { VakufMarkerDetails } from '../../interface/Marker';
import { createParagraphHTML, getParagraphDetails, linkSuccess } from './paragraph-blueprint';

/**
 * Generates HTML content for an InfoWindow associated with a given marker. This function constructs the content by 
 * combining marker details, including type, name, and additional paragraphs of information. It also includes an 
 * interactive section for viewing vakuf images and a support message for submitting better images.
 *
 * The function starts by retrieving paragraph details for the marker, converting these details into HTML paragraphs. 
 * It then constructs the overall HTML structure for the InfoWindow, which includes a header with the vakuf name and 
 * an icon indicating the type of vakuf (e.g., mosque or land parcel). Additionally, it provides a link to toggle 
 * visibility of the vakuf image and another link to expand a message offering users the ability to submit their own 
 * images if they have a better one.
 *
 * @param {VakufMarkerDetails} marker - The marker object containing details about the vakuf, including its type, name, 
 *                                image URL, and other relevant information used to populate the InfoWindow content.
 * @returns {string} The fully constructed HTML content for the InfoWindow, ready to be displayed to the user.
 */
export function infoWindowStyle(marker: VakufMarkerDetails) {

  const paragraphDetails = getParagraphDetails(marker);
  const paragraphsHtml = paragraphDetails.map(({ icon, title, content }) =>
    createParagraphHTML(icon, title, content)).join('');
    
    let infoWindowHtmlContent = `
    <div class="gm-style-iw m-2">
    <div class="row">
      <div class="col-12 col-lg-6">
        <h5 title='Naziv vakufa' class="word-wrap fw-normal text-center">
          <span>
            ${
              marker.vakufType === 'Džamija'
                ? '<span title="Simbolički grafički prikaz džamije" class="material-symbols-outlined">mosque</span>'
                : '<span title="Simbolički grafički prikaz parcele" class="material-symbols-outlined">file_map</span>'
            }
          </span>
          ${marker.vakufName}
        </h5>
        <hr>
        ${paragraphsHtml}
      </div>
  
      <div class="col-12 col-lg-6 text-center">
        <h6 class="fw-normal">
          <span class="material-symbols-outlined">imagesmode</span> Fotografija vakufa:
        </h6>
        <a
          title='Fotografija vakufa'
          id="viewImageControlHeight"
          href="#viewImageControl"
          class="fs-6 mt-2 mb-2 ${linkSuccess}"
          data-bs-toggle="collapse"
          role="button"
          aria-expanded="false"
          aria-controls="viewImageControl"
          aria-label="Show image of the vakuf"
        >
          ${
            marker.vakufType === 'Džamija'
              ? 'Prikaži sliku džamije'
              : 'Prikaži sliku parcele'
          }
        </a>
        <a
          title='Link za podršku'
          class="link-success link-underline link-underline-opacity-0"
          data-bs-toggle="collapse"
          href="#imageSupportCollapse"
          role="button"
          aria-expanded="false"
          aria-controls="imageSupportCollapse"
          aria-label="Show support message"
        >
          |
          <span class="material-symbols-outlined fs-3">contact_support</span>
        </a>
        <div
          id="imageSupportCollapse"
          class="collapse fs-6 fw-lighter word-wrap mt-2 mb-2"
        >
          Imate ljepšu fotografiju vakufa? 
          <a class="fs-6 ${linkSuccess}" href="mailto:dev.ervinpepic@gmail.com"> Pošaljite nam.</a>
        </div>
        <img
          title='Fotografija vakufa'
          src="${marker.vakufImage}"
          alt="Fotografija vakufa"
          id="viewImageControl"
          class="collapse img-fluid img-thumbnail rounded mt-2 mb-2"
          style="width: 100%; height: auto;"
        >
      </div>
    </div>
  </div>`;

  return infoWindowHtmlContent;
}
