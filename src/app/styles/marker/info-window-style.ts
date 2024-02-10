import { CustomMarker } from "../../interface/Marker";
const paragraphTitleClass = "fs-6 text-center text-nowrap fw-light"
const paragraphContentClass = "fs-6 text-center word-wrap fw-normal";
export function infoWindowStyle(marker: CustomMarker) {
  // Start building the HTML content for the InfoWindow
  let infoWindowHtmlContent = 
    "<div class='gm-style-iw m-2'>" +
      "<div class='row'>" +
        // Left column: Basic information about the object or place
        "<div class='col-12 col-lg-6'>" +
        // Display the name of the object or place
          `<h5 class='word-wrap fw-normal text-center'>
            <span>
              ${marker.vakufType === "Džamija" 
                ? '<span class="material-symbols-outlined">mosque</span>' 
                : '<span class="material-symbols-outlined">file_map</span>'
              }
            </span>
            ${marker.vakufName}
          </h5>` +
          "<hr>" +
          // Year of construction or endowment
          `<p class='${paragraphTitleClass}'>
            <span class='material-symbols-outlined'>calendar_month</span>
              ${marker.vakufType === 'Džamija' ? 'Izgrađena: ' : 'Uvakufljeno: '}
            <span class='d-block ${paragraphContentClass}'>
              ${marker.yearFounded != '' ? `${marker.yearFounded}. god.` : 'Nema datum'}
            </span>
          </p>` +
          // Cadastral parcel number
          `<p class='${paragraphTitleClass}'>
            <span class='material-symbols-outlined'>map</span> Katastarska parcela: 
            <span class='d-block ${paragraphContentClass}'>
              ${marker.cadastralParcelNumber}
            </span>
          </p>` +
          // Real estate number
          `<p class='${paragraphTitleClass}'>
            <span class='material-symbols-outlined'>contract</span> List nepokretnosti: 
            <span class='d-block ${paragraphContentClass}'>
              ${marker.realEstateNumber}
            </span>
          </p>` +
           // Area size of the parcel
          `<p class='${paragraphTitleClass}'>
           <span class='material-symbols-outlined'>area_chart</span> Površina parcele: 
           <span class='d-block ${paragraphContentClass}'>
             ${marker.areaSize}m<sup>2</sup>
           </span>
          </p>` +
          // Cadastral municipality
          `<p class='${paragraphTitleClass}'>
            <span class='material-symbols-outlined'>location_city</span> Katastarska opština: 
            <span class='d-block ${paragraphContentClass}'>
              ${marker.cadastralMunicipality}
            </span>
          </p>` +
          // Street name
          `<p class='${paragraphTitleClass}'>
            <span class='material-symbols-outlined'>signpost</span> Ulica | Potes: 
            <span class='d-block ${paragraphContentClass}'>
              ${marker.streetName}
            </span>
          </p>` +
        "</div>" +
        // Right column: Image section
        "<div class='col-12 col-lg-6 text-center'>" +
          "<h6 class='fw-normal'>" +
              "<span class='material-symbols-outlined'>imagesmode</span> Fotografija Vakufa: " +
          '</h6>' +
          // Link to show/hide the image section
            `<a
              id='viewImageControlHeight'
              href='#viewImageControl'
              class='link-success fs-6 mt-2 mb-2 link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover' 
              data-bs-toggle='collapse' 
              role='button' 
              aria-expanded='false' 
              aria-controls='viewImageContro'>
              ${marker.vakufType === "Džamija" ? 'Prikaži sliku džamije' : 'Prikaži sliku parcele'}
            </a>` +
            `<a 
                class='link-success'
                data-bs-toggle='collapse' 
                href='#imageSupportCollapse' 
                role='button' 
                aria-expanded='false'
                aria-controls='imageSupportCollapse'
            >
                  <span class='material-symbols-outlined fs-2'>contact_support</span>
            </a>` +
            `<div 
              id='imageSupportCollapse'
              class='collapse fs-6 fw-lighter word-wrap mt-2 mb-2'
            >
                Imate ljepšu fotografiju vakufa? 
                <a 
                  class='link-success fs-6 link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover' 
                  href='mailto:dev.ervinpepic@gmail.com'>Pošaljite nam.
                </a>
            </div>` +
          // Image section (collapsed by default)
          `<img src='${marker.vakufImage}' 
            id='viewImageControl'
            class='collapse img-fluid img-thumbnail rounded mt-2 mb-2'
            width='100%'
            height='100%'
          >` +
          "</div>"+
        "</div>" +

      "</div>" +
    "</div>"
  return infoWindowHtmlContent
}
