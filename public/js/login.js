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

async function registerCheck(email, username, password, cpassword){
    if(password != cpassword){
        customAlert("Password not the same")
        return
    }

    const myObj = {
        email: email,
        username: username,
        password: password
    }
    
    const jString = JSON.stringify(myObj);
    try {
        const response = await fetch("/registerCheck", {
            method: 'POST',
            body: jString,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 201) {
            // customAlert("Good Job!");
            window.location.href = '/dbview';
        } 
        else if (response.status === 409) {
            customAlert("Account already exists.");
        }
        else if (response.status === 500) {
            customAlert("Server error.");
        } 

        
    } catch (error) {
        console.error('Error during account check:', error);
        customAlert("An unexpected error occurred.");
    }
}

const regform = document.getElementById('reg-form');
const logform = document.getElementById('login_form');

if(logform){
    logform.addEventListener('submit', async function(event) {
        event.preventDefault();
    
        const formData = new FormData(logform);
        
        await checkAccount(formData.get("username"), formData.get("password"));
    });
}




if(regform){
    regform.addEventListener('submit', async function (e) {
        e.preventDefault();
    
        const formData = new FormData(regform);

        const submitButton = regform.querySelector('button[type="submit"]');
        submitButton.disabled = true;
    
        try {
            await registerCheck(
                formData.get("email"),
                formData.get("username"),
                formData.get("password"),
                formData.get("cpassword")
            );
        } catch (error) {
            console.error("Error during form submission:", error);
        } finally {
            // Re-enable the submit button
            submitButton.disabled = false;
        }
    });
}





//* Custom Alert functions /
function customAlert(message) {
    document.getElementById('alertMessage').textContent = message;
    document.getElementById('customAlert').style.display = 'block';
}

function closeCustomAlert() {
    document.getElementById('customAlert').style.display = 'none';
}
//* End of Custom Alert functions /
