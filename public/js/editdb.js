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

function sortTable(columnIndex) {
    const table = document.querySelector("table");
    const rows = Array.from(table.querySelectorAll("tbody tr"));

    const isAscending = table.dataset.sortOrder === "asc";
    table.dataset.sortOrder = isAscending ? "desc" : "asc";

    rows.sort((a, b) => {
        const aText = a.children[columnIndex].innerText.trim();
        const bText = b.children[columnIndex].innerText.trim();

        if (columnIndex === 6 || columnIndex === 7) {
            // Parse date-time format (e.g., "2024-12-03 - 10:00 AM")
            const parseDateTime = (text) => {
                const [datePart, timePart] = text.split(" - ");
                return new Date(`${datePart} ${timePart}`);
            };

            const aDate = parseDateTime(aText);
            const bDate = parseDateTime(bText);

            return isAscending ? aDate - bDate : bDate - aDate;
        }  else if (!isNaN(parseInt(aText)) && !isNaN(parseInt(bText))) {
            // Sort numbers
            return isAscending
                ? parseInt(aText) - parseInt(bText)
                : parseInt(bText) - parseInt(aText);
        } else {
            // Sort strings
            return isAscending
                ? aText.localeCompare(bText)
                : bText.localeCompare(aText);
        }
    });

    const tbody = table.querySelector("tbody");
    rows.forEach(row => tbody.appendChild(row));
}