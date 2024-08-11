// the active page of the form
let activePage;

// the pages of the form
let pages;

// the chechpoints of the progress bar
let progressCheckpoints;

// the lines of the progress bar connecting the checkpoints
let progressLines;

// the text which shows the progress of the user under the progress bar checkpoints
let progressText;

// determines if the search box has been filled out with an address selected from the autocomplete dropdown
let searchable = false;

const serviceSelector = document.getElementById("service-selector");

// button to look up the address
const quoteButton = document.getElementById("quote-button");

// button to get the area of the polygon
const getAreaButton = document.getElementById("get-area");

// the box where the user can enter an address
const searchBox = document.getElementById("search");

// the autocomplete object
let autocomplete;

// the map object
const map = document.getElementById("map");

// the drawing manager object
let drawingManager;

// the area of the polygons
let area;

// the polygons
let polygons = [];

// the number of polygons, used to assign an id to each polygon
let numPolygons = 0;

const serviceSelectionColumns = document.getElementById(
  "service-selection-columns"
);

const serviceSelectorMaxWidth = window
  .getComputedStyle(serviceSelector)
  .maxWidth.replace("px", "");

let nextButtons;

let backButtons;

// the parent container for the services
let serviceContainer;

// dummy data for the services
let estServices = [
  { name: "Lawn Mowing", range: "$000.00 - $9,999.00" },
  { name: "Leaf Removal", range: "$000.00 - $9,999.00" },
  { name: "Hedge Trimming", range: "$000.00 - $9,999.00" },
  { name: "Lawn Fertilization", range: "$000.00 - $9,999.00" },
  { name: "Weed Control", range: "$000.00 - $9,999.00" },
  { name: "Aeration", range: "$000.00 - $9,999.00" },
];

// event listener for the DOMContentLoaded event
// initializes the variables and adds event listeners
document.addEventListener("DOMContentLoaded", function () {
  checkOrientation();

  window.addEventListener("resize", checkOrientation);

  activePage = document.getElementById("service-selector");

  nextButtons = document.querySelectorAll(".next");
  listenNext();

  backButtons = document.querySelectorAll(".back");
  listenBack();

  let services = document.querySelectorAll(".service");
  services.forEach((service) => {
    service.addEventListener(
      "click",
      function () {
        select(service);
      },
      { once: true }
    );
  });

  progressLines = document.querySelectorAll(".progress-bar-line");

  progressText = document.querySelectorAll(".progress-text");
  progressText[0].classList.add("active-progress-text");
  progressText[0].classList.add("activated-progress-text");

  progressCheckpoints = document.querySelectorAll(".checkpoint");
  progressCheckpoints[0].classList.add("active-progress");
  progressCheckpoints = Array.from(progressCheckpoints).slice(1);

  pages = [
    document.getElementById("service-selector"),
    document.getElementById("service-details"),
    document.getElementById("estimates"),
    document.getElementById("submit"),
  ];
  console.log("Services:", services);

  serviceContainer = document.getElementById("service-container");
  outputServices(estServices);
});

function outputServices(estServices) {
  estServices.forEach((service) => {
    let serviceRange = document.createElement("div");
    serviceRange.classList.add("service-range");

    let serviceName = document.createElement("div");
    serviceName.classList.add("service-range-text");
    serviceName.textContent = service.name;

    let servicePrice = document.createElement("div");
    servicePrice.classList.add("service-range-text");
    servicePrice.textContent = service.range;

    serviceRange.appendChild(serviceName);
    serviceRange.appendChild(servicePrice);

    serviceContainer.appendChild(serviceRange);
  });
}

function listenNext() {
  nextButtons.forEach((button) => {
    button.addEventListener("click", next);
  });
}

function listenBack() {
  backButtons.forEach((button) => {
    button.addEventListener("click", back);
  });
}

function ignoreNext() {
  nextButtons.forEach((button) => {
    button.removeEventListener("click", next);
  });
}

function ignoreBack() {
  backButtons.forEach((button) => {
    button.removeEventListener("click", back);
  });
}

// function to go to the next page
function next() {
  if (activePage === pages[pages.length - 1]) {
    return;
  }

  ignoreNext();
  ignoreBack();

  let currentPageIndex = pages.indexOf(activePage);
  let newActivePage = pages[currentPageIndex + 1];

  progressLines[currentPageIndex].classList.add("active-progress");
  progressCheckpoints[currentPageIndex].classList.add("active-progress");

  slideLeft(activePage);
  slideIn(newActivePage);

  activePage.addEventListener("transitionend", function handleTransition() {
    activePage.style.display = "none";
    activePage.removeEventListener("transitionend", handleTransition);
    activePage = newActivePage;
    progressText[currentPageIndex + 1].classList.add("activated-progress-text");
    progressText[currentPageIndex + 1].classList.add("active-progress-text");
    progressText[currentPageIndex].classList.remove("active-progress-text");
    // check if page is the service details page and if it is, call the initAutocomplete function
    if (activePage === pages[1]) {
      initAutocomplete();
    }
    listenNext();
    listenBack();
  });
}

// function to go back to the previous page
function back() {
  if (activePage === pages[0]) {
    return;
  }

  ignoreNext();
  ignoreBack();

  let currentPageIndex = pages.indexOf(activePage);
  let newActivePage = pages[currentPageIndex - 1];

  progressLines[currentPageIndex - 1].classList.remove("active-progress");
  progressText[currentPageIndex].classList.remove("activated-progress-text");
  progressText[currentPageIndex].classList.remove("active-progress-text");
  progressCheckpoints[currentPageIndex - 1].classList.remove("active-progress");
  progressText[currentPageIndex - 1].classList.add("active-progress-text");

  slideRight(activePage);
  slideIn(newActivePage);

  activePage.addEventListener("transitionend", function handleTransition() {
    activePage.style.display = "none";
    activePage.removeEventListener("transitionend", handleTransition);
    activePage = newActivePage;
    listenNext();
    listenBack();
  });
}

// function to slide the page to the left
function slideLeft(page) {
  requestAnimationFrame(() => {
    page.style.transform = "translateX(-100vw)";
  });
}

// function to slide the page to the center
function slideIn(page) {
  page.style.display = "flex";
  requestAnimationFrame(() => {
    page.style.transform = "translateX(0)";
  });
}

// function to slide the page to the right
function slideRight(page) {
  requestAnimationFrame(() => {
    page.style.transform = "translateX(100vw)";
  });
}

// selects a service and adds it to the selected services list
function select(service) {
  if (service.classList.contains("selected-service")) {
    return;
  }
  let newService = service.cloneNode(true);
  newService.classList.add("added-service");
  service.classList.add("selected-service");
  document.getElementById("selected-services").appendChild(newService);
  service.addEventListener(
    "click",
    function () {
      deselect(service);
      document.getElementById("selected-services").removeChild(newService);
    },
    { once: true }
  );
}

// deselects a service and removes it from the selected services list
function deselect(service) {
  if (!service.classList.contains("selected-service")) {
    return;
  }
  service.classList.remove("selected-service");
  service.addEventListener(
    "click",
    function () {
      select(service);
    },
    { once: true }
  );
}

function checkOrientation() {
  const exitElement = document.getElementById("exit");
  const serviceSelectionColumn = document.getElementById(
    "service-selection-column"
  );
  const landscapeServiceSelectionColumn = document.getElementById(
    "landscape-service-selection-column"
  );

  if (window.innerHeight > window.innerWidth) {
    if (exitElement) {
      exitElement.style.display = "none";
    }
  } else {
    if (exitElement) {
      exitElement.style.display = "block";
    }
  }

  if (window.innerWidth < serviceSelectorMaxWidth) {
    console.log("mobile");
    landscapeServiceSelectionColumn.style.display = "none";
    serviceSelectionColumn.classList.add("service-selection-column-mobile");
  } else {
    landscapeServiceSelectionColumn.style.display = "flex";
    serviceSelectionColumn.classList.remove("service-selection-column-mobile");
  }
}

// initializes the autocomplete object and adds event listeners
function initAutocomplete() {
  // create the autocomplete object
  autocomplete = new google.maps.places.Autocomplete(searchBox, {
    componentRestrictions: { country: "us" },
    fields: ["geometry"],
  });

  // adds an event listener to the autocomplete object to detect when the user has selected an address
  autocomplete.addListener("place_changed", addressSelected);

  // adds event listener to the search box so that any input will make the quote button unclickable
  // until the user has selected an address from the autocomplete dropdown
  searchBox.addEventListener("input", function () {
    searchable = false;
    quoteButton.style.backgroundColor = "#BDBDBD";
  });

  // adds event listener to the search box so that the enter key does not invoke a 'place_changed' event
  searchBox.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.stopImmediatePropagation();
    }
  });

  // adds event listeners to the quote button to call the search function on click
  quoteButton.addEventListener("click", search);

  // adds event listener to the get area button to call the getArea function on click
  getAreaButton.addEventListener("click", getArea);
}

// function to be called when the user has selected an address from the autocomplete dropdown
// makes the quote button clickable and green
function addressSelected() {
  // quote button is now clickable
  searchable = true;
  // change the color of the quote button to green
  quoteButton.style.backgroundColor = "#4CAF50";
}

// function to be called when the user has clicked the quote button
function search() {
  if (searchable) {
    // remove the polygons on the map if it already exists
    polygons = [];
    // get the place object from the autocomplete object
    const place = autocomplete.getPlace();
    // get the latitude and longitude of the place
    longitude = place.geometry.location.lng();
    latitude = place.geometry.location.lat();
    // create the map object
    staticMapImg = new google.maps.Map(map, {
      center: { lat: latitude, lng: longitude },
      zoom: 21,
      minZoom: 17,
      maxZoom: 21,
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeId: "satellite",
      tilt: 0,
      restriction: {
        latLngBounds: {
          north: latitude + 0.005,
          south: latitude - 0.005,
          east: longitude + 0.005,
          west: longitude - 0.005,
        },
        strictBounds: true,
      },
    });
    // create the drawing manager object
    drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        fillColor: "#FF0000",
        fillOpacity: 0.5,
        strokeWeight: 3,
        clickable: true,
        editable: false,
        zIndex: 1,
      },
    });
    // set the map for the drawing manager
    drawingManager.setMap(staticMapImg);
    // add event listener to the drawing manager to detect when a polygon has been completed
    google.maps.event.addListener(
      drawingManager,
      "polygoncomplete",
      function (newPolygon) {
        let polygon = newPolygon;
        // set the id of the polygon
        polygon.id = numPolygons;
        numPolygons++;
        // add the polygon to the polygons array
        polygons.push(polygon);
        // add event listener to the polygon to detect when it has been clicked and should be removed
        google.maps.event.addListener(polygon, "click", function () {
          // remove the polygon from the polygons array
          polygons = polygons.filter((poly) => poly.id !== polygon.id);
          // remove the polygon from the map
          polygon.setMap(null);
        });
      }
    );
  } else {
    return;
  }
}

// function to be called when the user has clicked the get area button
function getArea() {
  area = 0;
  // iterate through the polygons array and calculate the area of each polygon
  for (let i = 0; i < polygons.length; i++) {
    let vertices = polygons[i].getPath();
    area = area + google.maps.geometry.spherical.computeArea(vertices);
  }
  // plugs the area into the html
  document.getElementById("area").innerHTML = area;
}
