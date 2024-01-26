import { CustomMarker } from "../../interface/Marker";
const paragraphCLass = "word-wrap fs-6"
export function infoWindowStyle(marker: CustomMarker) {
  // Start building the HTML content for the InfoWindow
  let infoWindowHtmlContent = 
    "<div class='gm-style-iw'>" +
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
          `<p class='${paragraphCLass}'>
            <span class='material-symbols-outlined'>calendar_month</span>
              ${marker.vakufType === 'Džamija' ? 'Izgrađena: ' : 'Uvakufljeno: '}
              ${marker.yearFounded != '' 
              ? `<strong>${marker.yearFounded}. god.</strong>` 
              : 'Nema datum'}
          </p>` +
          // Cadastral parcel number
          `<p class='${paragraphCLass}'>
            <span class='material-symbols-outlined'>map</span> Katastarska parcela: <strong>${marker.cadastralParcelNumber}</strong>
          </p>` +
          // Area size of the parcel
          `<p class='${paragraphCLass}'>
            <span class='material-symbols-outlined'>area_chart</span> Površina parcele: <strong>${marker.areaSize}m<sup>2</sup></strong>
          </p>` +
          // Real estate number
          `<p class='${paragraphCLass}'>
            <span class='material-symbols-outlined'>contract</span> List nepokretnosti: <strong>${marker.realEstateNumber}</strong>
          </p>` +
          // Cadastral municipality
          `<p class='${paragraphCLass}'>
            <span class='material-symbols-outlined'>location_city</span> Katastarska opština: <strong>${marker.cadastralMunicipality}</strong>
          </p>` +
          // Street name
          `<p class='${paragraphCLass}'>
            <span class='material-symbols-outlined'>signpost</span> Ulica | Potes: <strong>${marker.streetName}</strong>
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
              class='link-secondary fs-6 mt-2 mb-2' 
              data-bs-toggle='collapse' 
              role='button' 
              aria-expanded='false' 
              aria-controls='viewImageContro'>
              ${marker.vakufType === "Džamija" ? 'Prikaži sliku džamije' : 'Prikaži sliku parcele'}
            </a>` +
          // Image section (collapsed by default)
          `<img src='${marker.vakufImage}'
            id='viewImageControl' 
            class='collapse img-fluid img-thumbnail rounded mt-2 mb-2'
            width='100%'
            height='100%'
          >` +
        "</div>" +

      "</div>" +
    "</div>"
  return infoWindowHtmlContent
}
