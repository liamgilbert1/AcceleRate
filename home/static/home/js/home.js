document.addEventListener('DOMContentLoaded', () => {
    const homePage = document.getElementById('home-page');
    const scrollIndicator = document.getElementById('scroll-indicator');
    let scrollAnimationBuffer = 50;

    homePage.addEventListener('scroll', () => {
        console.log(homePage.scrollTop + homePage.clientHeight + scrollAnimationBuffer);
        console.log(homePage.scrollHeight);
        if ((homePage.scrollTop + homePage.clientHeight + scrollAnimationBuffer) > homePage.scrollHeight) {
            scrollIndicator.style.display = 'none';
        }
        else {
            scrollIndicator.style.display = 'block';
        }
    });
});