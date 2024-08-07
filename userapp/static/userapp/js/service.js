let activePage;
let pages;
let nextButtons;
let backButtons;

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


    pages = [document.getElementById("service-selector"), document.getElementById("service-details"), document.getElementById("estimates"), document.getElementById("submit")];
    console.log("Pages:", pages);
});

function next() {
    if (activePage === pages[pages.length - 1]) {
        return;
    }

    let currentPageIndex = pages.indexOf(activePage);
    let newActivePage = pages[currentPageIndex + 1];
    
    slideLeft(activePage);
    slideIn(newActivePage);
    
    activePage.addEventListener("transitionend", function handleTransition() {
        activePage.style.display = "none";
        activePage.removeEventListener("transitionend", handleTransition);
        activePage = newActivePage;
    });
}

function back() {
    if (activePage === pages[0]) {
        return;
    }

    let currentPageIndex = pages.indexOf(activePage);
    let newActivePage = pages[currentPageIndex - 1];
    
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

