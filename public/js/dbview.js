document.addEventListener('DOMContentLoaded', function() {
    const pageTitle = document.title.split(' ')[0]; // Get the current page title
    const menuItems = document.querySelectorAll('.menu-item');

    console.log("Page title: " + pageTitle);

    console.log("Menu items:");
    menuItems.forEach(item => {
        console.log(item.textContent.split(' ')[0]); // Logs true if they match, false otherwise
    });
    

    menuItems.forEach(item => {
        // Check if the title matches the link text or a part of the URL
        if (pageTitle === item.textContent.split(' ')[0]) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
});
