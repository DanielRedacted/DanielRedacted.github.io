
var topNav = document.querySelector('#topnav');
var hotdog = document.querySelector('#hotdog');
var rightSidebar = document.querySelector('#right-socials');
var menuButton = document.querySelector('#dropdown');
var closeMenu = document.querySelector('#closeMenu');
var openMenu = document.querySelector('#openMenu');

window.addEventListener('resize', function() {

    // if (window.innerWidth <= window.innerHeight) {
    if (topNav.clientWidth < 662) {
        hotdog.style.display = 'none';
        menuButton.style.display = 'flex';
    } else {
        hotdog.style.display = 'flex';
        rightSidebar.style.display = 'none';
        menuButton.style.display = 'none';
        openMenu.style.display = 'block';
        closeMenu.style.display = 'none';
    }
});

function toggleMenu() {
    if (rightSidebar.style.display == 'flex') {
        rightSidebar.style.display = 'none'
        openMenu.style.display = 'block';
        closeMenu.style.display = 'none';
    } else {
        rightSidebar.style.display = 'flex'
        openMenu.style.display = 'none';
        closeMenu.style.display = 'block';
    }
}




// const container = document.querySelector('#topnav');
// const drop = document.querySelector('#dropdown');
// const navWidth = container.scrollWidth 

// window.addEventListener('resize', function() {
//     if (container.scrollWidth > container.clientWidth) {
//         topNav.style.display = 'none';
//         menuButton.style.display = 'flex';
//     } else  {
//         topNav.style.display = 'flex';
//         rightSidebar.style.display = 'none';
//         menuButton.style.display = 'none';
//     }
// });


// // Create a ResizeObserver to monitor for size changes
// const resizeObserver = new ResizeObserver(checkOverflow);

// // Start observing the container
// resizeObserver.observe(container);

// // You may want to check for overflow initially
// checkOverflow();




// Initial check on page load
document.addEventListener('DOMContentLoaded', function() {
    var event = new Event('resize');
    window.dispatchEvent(event);
});