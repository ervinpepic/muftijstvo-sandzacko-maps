export function infoWindowStyle(marker: any) {
  // Start building the HTML content for the InfoWindow
  return (
    "<div class='infowindow'>" +
      "<div class='row p-1'>" +
        // Left column: Basic information about the object or place
        "<div class='col-12 col-lg-6'>" +
          "<p class='lead'>" +
            "<i class='fa-solid fa-mosque'></i> - <i class='fa-solid fa-location-dot'>" +
            '</i> Naziv objekta / Mjesta:' +
          '</p>' +
          // Display the name of the object or place
          "<h4 class='mb-2'>" + marker.vakufName + '</h4>' +
          '<hr>' +
          // Year of construction or endowment
          "<p class='lead'>" + 
            '<span><strong>' +
              "<i class='fa-solid fa-calendar-days'></i> Godina izgradnje-uvakufljenja: " +
            '</strong></span>' + marker.yearFounded + ' godine' +
          '</p>' +
          // Cadastral parcel number
          "<p class='lead'>" +
            '<span><strong>' +
              "<i class='fa-regular fa-map'></i> Katastarska parcela: " +
            '</strong></span>' + marker.cadastralParcelNumber +
          '</p>' +
          // Area size of the parcel
          "<p class='lead'>" +
            '<span><strong>' +
            "<i class='fa-solid fa-map-location-dot'></i> Površina parcele: " +
            '</strong></span>' + marker.areaSize + ' m<sup>2</sup>' +
          '</p>' +
          // Real estate number
          "<p class='lead'>" +
            '<span><strong>' +
              "<i class='fa-solid fa-scroll'></i> List nepokretnosti: " +
            '</strong></span>' + marker.realEstateNumber +
          '</p>' +
          // Cadastral municipality
          "<p class='lead'>" +
            '<span><strong>' +
              "<i class='fa-solid fa-city'></i> Katastarska opština: " +
            '</strong></span>' + marker.cadastralMunicipality +
          '</p>' +
          // Street name
          "<p class='lead'>" + 
            '<span><strong>' +
              "<i class='fa-solid fa-road'></i> Ulica: " +
            '</strong></span>' + marker.streetName +
          '</p>' +
          '<hr>' +
        '</div>' +
        // Right column: Image section
        "<div class='col-12 col-lg-6'>" +
          "<p class='lead'>" +
            '<span><strong>' +
              "<i class='fa-solid fa-image'></i> Slika objekta / Parcele: " +
            '</strong></span>' +
          '</p>' +
          // Link to show/hide the image section
          "<p class='lead mt-2 mb-2'>" +
            '<span><strong>' +
              "<a class='link-success mt-1	' data-bs-toggle='collapse' href='#viewImageControl' role='button' aria-expanded='false' aria-controls='viewImageContro'>" +
                'Prikaži sliku' +
              '</a>' +
            '</strong></span>' +
          '</p>' +
          // Image section (collapsed by default)
          "<img src='" + marker.vakufImage +
            "' id='viewImageControl' class='collapse img-fluid rounded mt-2' width='100%' height='100%'>" +
        '</div>' +
      '</div>' +
    '</div>'
  );
}
