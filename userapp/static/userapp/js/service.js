let activePage;
let pages;
let nextButtons;
let backButtons;
let progressCheckpoints;
let progressLines;
let progressText;
let services;

document.addEventListener("DOMContentLoaded", function() {

    activePage = document.getElementById("service-selector");
    
    nextButtons = document.querySelectorAll('.next');
    nextButtons.forEach(button => {
        button.addEventListener("click", next);
    });

    backButtons = document.querySelectorAll('.back');
    backButtons.forEach(button => {
        button.addEventListener("click", back);
    });

    services = document.querySelectorAll('.service');
    services.forEach(service => {
        service.addEventListener("click", function() {
            select(service)
        });
    });

    progressLines = document.querySelectorAll('.progress-bar-line');
    
    progressText = document.querySelectorAll('.progress-text');
    progressText[0].classList.add("active-progress-text");
    progressText[0].classList.add("activated-progress-text");

    progressCheckpoints = document.querySelectorAll('.checkpoint');
    progressCheckpoints[0].classList.add("active-progress");
    progressCheckpoints = Array.from(progressCheckpoints).slice(1);

    pages = [document.getElementById("service-selector"), document.getElementById("service-details"), document.getElementById("estimates"), document.getElementById("submit")];
    console.log("Services:", services);
});

function next() {
    if (activePage === pages[pages.length - 1]) {
        return;
    }

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
    });
}

function back() {
    if (activePage === pages[0]) {
        return;
    }

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
    });
}

function slideLeft(page) {
    requestAnimationFrame(() => {
        page.style.transform = "translateX(-100vw)";
    });
}

function slideIn(page) {
    page.style.display = "flex";
    requestAnimationFrame(() => {
        page.style.transform = "translateX(0)";
    });
}

function slideRight(page) {
    requestAnimationFrame(() => {
        page.style.transform = "translateX(100vw)";
    });
}


function select(service) {
    document.getElementById("services").removeChild(service);
    service.classList.add("selected-service");
    document.getElementById("selected-services").appendChild(service);
    service.removeEventListener("click", function(){});
    service.addEventListener("click", function() {
        deselect(service);
    });
}

function deselect(service) {
    document.getElementById("selected-services").removeChild(service);
    service.classList.remove("selected-service");
    document.getElementById("services").appendChild(service);
    service.removeEventListener("click", function(){});
    service.addEventListener("click", function() {
        select(service);
    });
}

