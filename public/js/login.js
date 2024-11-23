async function checkAccount(username, password) {
    const myObj = { 
        username: username,
        password: password
    };

    const jString = JSON.stringify(myObj);

    try {
        const response = await fetch("/checkAccount", {
            method: 'POST',
            body: jString,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            // customAlert("Good Job!");
            window.location.href = '/dbview';
        } 
        else if (response.status === 404) {
            customAlert("Account not found.");
        }
        else if (response.status === 401) {
            customAlert("Incorrect password.");
        } 
        else if (response.status === 500) {
            customAlert("Server error.");
        } 

    } catch (error) {
        console.error('Error during account check:', error);
        customAlert("An unexpected error occurred.");
    }
}

document.getElementById('login_form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const form = document.getElementById('login_form');
    const formData = new FormData(form);
    
    await checkAccount(formData.get("username"), formData.get("password"));
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
