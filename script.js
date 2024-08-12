window.addEventListener('resize', function() {
    var topNav = document.querySelector('#top-socials');
    var rightSidebar = document.querySelector('#right-socials');

    if (window.innerWidth <= window.innerHeight) {
        topNav.style.display = 'none';
        rightSidebar.style.display = 'flex';
    } else {
        topNav.style.display = 'flex';
        rightSidebar.style.display = 'none';
    }
});

// Initial check on page load
document.addEventListener('DOMContentLoaded', function() {
    var event = new Event('resize');
    window.dispatchEvent(event);
});