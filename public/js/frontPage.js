document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("reference-form");
    console.log(form);
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();  // Prevent the default form submission

            const refCode = document.getElementById("ref-no").value.trim();
            
            if (!refCode) {
                return; // Optionally, you can show an alert if refCode is empty.
            }

            // Send AJAX request to server to check if reference code exists
            try {
                const response = await fetch(`/status?refCode=${encodeURIComponent(refCode)}`);
                if (response.status === 404) {
                    // If no matching form is found, show the custom alert
                    customAlert("No matching reference code found. Please try again.");
                } else if (response.ok) {
                    // If reference code is found, you can process the response (e.g., show status page)
                    window.location.href = '/status'; // or handle accordingly
                } else {
                    // Handle other response statuses (optional)
                    customAlert("An error occurred while checking the reference code.");
                }
            } catch (error) {
                console.error(error);
                customAlert("An error occurred while checking the reference code.");
            }
        });
    }
});

//* Custom Alert functions /
function customAlert(message) {
    document.getElementById('alertMessage').textContent = message;
    document.getElementById('customAlert').style.display = 'block';
}

function closeCustomAlert() {
    document.getElementById('customAlert').style.display = 'none';
}
//* End of Custom Alert functions /