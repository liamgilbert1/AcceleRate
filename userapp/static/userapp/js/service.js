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

const exitElement = document.getElementById("exit");
const serviceSelectionColumn = document.getElementById(
  "service-selection-column"
);
const landscapeServiceSelectionColumn = document.getElementById(
  "landscape-service-selection-column"
);

const serviceSelector = document.getElementById("service-selector");

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

let screenOrientation;

const serviceSelectionColumns = document.getElementById(
  "service-selection-columns"
);

const serviceSelectorMaxWidth = window
  .getComputedStyle(serviceSelector)
  .maxWidth.replace("px", "");

let nextButtons;

let backButtons;

let submitButton;

let currentService;

// the parent container for the services
let serviceContainer;

// dummy data for the services
let estServices = [];

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

  submitButton = document.getElementById("submit-button");
  listenSubmit();

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

async function outputServices() {
  serviceContainer.innerHTML = "";
  for (service of estServices) {
    let serviceRange = document.createElement("div");
    serviceRange.classList.add("service-estimate");

    let serviceName = document.createElement("div");
    serviceName.classList.add("service-range-text");
    serviceName.textContent = service.name;

    let servicePrice = document.createElement("div");
    servicePrice.classList.add("service-range-text");
    try {
      // Fetch the quote asynchronously
      const price = await getQuote();

      // Debug: Check what price is returned
      console.log("Returned price:", price);

      // Check if price is a valid number and display it
      if (price !== undefined && price !== null) {
        // Format the price
        servicePrice.textContent = "$" + parseFloat(price).toFixed(2);
      } else {
        servicePrice.textContent = "Price not available";
      }
    } catch (error) {
      // Handle any errors from getQuote
      console.error("Error fetching quote:", error);
      servicePrice.textContent = "Error fetching price";
    }

    // Append the service details to the container
    serviceRange.appendChild(serviceName);
    serviceRange.appendChild(servicePrice);
    serviceContainer.appendChild(serviceRange);
  };
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

function listenSubmit() {
  console.log("Listening for submit");
  submitButton.addEventListener("click", submit);
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

function ignoreSubmit() {
  submitButton.removeEventListener("click", submit);
}

// function to go to the next page
function next() {
  if (activePage === pages[pages.length - 1]) {
    return;
  }

  ignoreNext();
  ignoreBack();
  ignoreSubmit();

  let currentPageIndex = pages.indexOf(activePage);
  let newActivePage = pages[currentPageIndex + 1];

  progressLines[currentPageIndex].classList.add("active-progress");
  progressCheckpoints[currentPageIndex].classList.add("active-progress");

  if (newActivePage === pages[2]) {
    outputServices();
  }

  slideLeft(activePage);
  slideIn(newActivePage);

  activePage.addEventListener("transitionend", function handleTransition() {
    activePage.style.display = "none";
    activePage.removeEventListener("transitionend", handleTransition);
    activePage = newActivePage;
    progressText[currentPageIndex + 1].classList.add("activated-progress-text");
    progressText[currentPageIndex + 1].classList.add("active-progress-text");
    progressText[currentPageIndex].classList.remove("active-progress-text");

    listenSubmit();
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

// function to submit the form
function submit() {
  pages[pages.length - 1].style.display = "none";

  postSubmit = document.getElementById("post-submit");
  postSubmit.style.display = "flex";
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
  document.getElementById("landscape-services").appendChild(newService);
  if (screenOrientation === "landscape") {
    newService.classList.add("added-service");
    service.classList.add("selected-service");
  } else {
    newService.classList.add("selected-service");
    service.classList.add("added-service");
  }
  estServices.push({ name: service.textContent, range: "$TBD-$TBD" });
  service.addEventListener(
    "click",
    function () {
      deselect(service);
      document.getElementById("landscape-services").removeChild(newService);
    },
    { once: true }
  );
}

// deselects a service and removes it from the selected services list
function deselect(service) {
  if (!service.classList.contains("selected-service")) {
    return;
  }
  if (screenOrientation === "landscape") {
    service.classList.remove("selected-service");
  } else {
    service.classList.remove("added-service");
  }
  estServices = estServices.filter(
    (estService) => estService.name !== service.textContent
  );
  service.addEventListener(
    "click",
    function () {
      select(service);
    },
    { once: true }
  );
}

function checkOrientation() {
  if (window.innerHeight > window.innerWidth) {
    if (exitElement) {
      exitElement.style.display = "none";
    }
    if (!screenOrientation) {
      screenOrientation = "portrait";
      landscapeServiceSelectionColumn.style.display = "none";
      serviceSelectionColumn.classList.add("service-selection-column-mobile");
    }
  } else {
    if (exitElement) {
      exitElement.style.display = "flex";
    }
    if (!screenOrientation) {
      screenOrientation = "landscape";
      landscapeServiceSelectionColumn.style.display = "flex";
      serviceSelectionColumn.classList.remove(
        "service-selection-column-mobile"
      );
    }
  }

  if (
    (window.innerWidth < serviceSelectorMaxWidth &&
      screenOrientation === "landscape") ||
    (window.innerWidth >= serviceSelectorMaxWidth &&
      screenOrientation === "portrait")
  ) {
    orientationSwap();
  }
}

function orientationSwap() {
  if (screenOrientation === "portrait") {
    landscapeServiceSelectionColumn.style.display = "flex";
    serviceSelectionColumn.classList.remove("service-selection-column-mobile");
    screenOrientation = "landscape";
  } else {
    landscapeServiceSelectionColumn.style.display = "none";
    serviceSelectionColumn.classList.add("service-selection-column-mobile");
    screenOrientation = "portrait";
  }

  // select all media with class selected-service
  // select all media with class added-service

  // add added-service to selected-service and remove selected-service
  // add selected-service to added-service and remove added-service

  let selectedServices = document.querySelectorAll(".selected-service");
  let addedServices = document.querySelectorAll(".added-service");

  selectedServices.forEach((service) => {
    service.classList.add("added-service");
    service.classList.remove("selected-service");
  });

  addedServices.forEach((service) => {
    service.classList.add("selected-service");
    service.classList.remove("added-service");
  });
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
  });

  // adds event listener to the search box so that the enter key does not invoke a 'place_changed' event
  searchBox.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.stopImmediatePropagation();
      if (searchable) {
        search();
      }
    }
  });

  // prevents control z or command z from undoing the user's input in the search box
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "z") {
      event.preventDefault();
    }
    if (event.metaKey && event.key === "z") {
      event.preventDefault();
    }
  });
}

// function to be called when the user has selected an address from the autocomplete dropdown
// makes the quote button clickable and green
function addressSelected() {
  // quote button is now clickable
  searchable = true;
  search();
  // keep the search box selected actively
  searchBox.focus();
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
async function getQuote() {
  area = 0;
  // iterate through the polygons array and calculate the area of each polygon
  for (let i = 0; i < polygons.length; i++) {
    let vertices = polygons[i].getPath();
    area = area + google.maps.geometry.spherical.computeArea(vertices);
  }

  // convert the area from square meters to square feet
  area = area * 10.7639;

  price = await calculateQuote(area);

  return price;
}

async function calculateQuote(squareFootage) {
  console.log("Calculating quote for square footage:", squareFootage);

  const data = {
    squareFootage: squareFootage,
  };

  try {
    const response = await fetch("/userapp/calculate-quote/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",  // Ensure the headers match what worked in curl
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error("Network response was not ok:", response.status, response.statusText);
      return;
    }

    const responseData = await response.json();
    console.log("Calculated price:", responseData.price);
    return responseData.price;

  } catch (error) {
    console.error("Error fetching quote:", error);
  }
}