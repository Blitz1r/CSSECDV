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

document.querySelector('.delete-button').addEventListener('click', (e) => {
    const checkboxes = document.querySelectorAll('.row-checkbox:checked');
    if (checkboxes.length === 0) {
        customAlert('Please select at least one item to delete.');
        return;
    }

    customAlert2(
        'Are you sure you want to delete the selected items?',
        function onConfirm() {
            // Perform the delete action on confirmation
            changeFormMethodAndAction('POST', '/editdb/delete');
        },
        function onCancel() {
            // Optionally handle cancel action
            console.log('User canceled the action.');
        }
    );
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

const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener('click', async function(e) {
    try {
        const response = await fetch("/logout", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            window.location.href = '/dbview/login';
        } else {
            customAlert("Server error.");
        }
    } catch (error) {
        console.error('Error during logout:', error);
        customAlert("An unexpected error occurred.");
    }
});


//* Custom Alert functions /
function customAlert(message) {
    document.getElementById('alertMessage1').textContent = message; // Updated ID
    document.getElementById('customAlert').style.display = 'block';
}

function customAlert2(message, onConfirm, onCancel) {
    document.getElementById('alertMessage2').textContent = message; // Updated ID

    const alertDiv = document.getElementById('customAlert2');
    alertDiv.style.display = 'block';

    alertDiv.querySelector('.ok-btn').onclick = function () {
        alertDiv.style.display = 'none';
        if (onConfirm) onConfirm();
    };

    alertDiv.querySelector('.cancel-btn').onclick = function () {
        alertDiv.style.display = 'none';
        if (onCancel) onCancel();
    };
}

function closeCustomAlert() {
    document.getElementById('customAlert').style.display = 'none';
    document.getElementById('customAlert2').style.display = 'none';
}
//* End of Custom Alert functions /