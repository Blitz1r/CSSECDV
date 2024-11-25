document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("reference-form");
    console.log(form);
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();  

            const refCode = document.getElementById("ref-no").value.trim();
            
            if (!refCode) {
                return; 
            }

            try {
                const response = await fetch(`/status?refCode=${encodeURIComponent(refCode)}`);
                if (response.status === 404) {
                    customAlert("No matching reference code found. Please try again.");
                } else if (response.ok) {
                    window.location = `/status?refCode=${encodeURIComponent(refCode)}`;
                } else {
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