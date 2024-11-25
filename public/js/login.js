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

    const submitButton = document.getElementById('submit');
    submitButton.classList.add('grayed');
    submitButton.disabled = true;
    regform.addEventListener('input', function () {
        const formData = new FormData(regform);
        updateSubmitButtonState(formData);
    });


    regform.addEventListener('submit', async function (e) {
        e.preventDefault();
    
        const formData = new FormData(regform);

        await registerCheck(formData.get("email"), formData.get("username"), formData.get("password"), formData.get("cpassword"));
    });
}


const passwordField = document.getElementById('password');
const requirements = document.getElementById('password-requirements');
const lengthRequirement = document.getElementById('length-requirement');
const uppercaseRequirement = document.getElementById('uppercase-requirement');
const numberRequirement = document.getElementById('number-requirement');
const specialRequirement = document.getElementById('special-requirement');

// Show the requirements when the password field is focused
passwordField.addEventListener('focus', function () {
    requirements.classList.remove('hidden');
});

// Hide the requirements when the password field is blurred, but only if all are met
passwordField.addEventListener('blur', function () {
    requirements.classList.add('hidden');
});

// Validate password on input
passwordField.addEventListener('input', function () {
    const password = passwordField.value;

    // Check individual requirements
    const isLengthValid = password.length >= 8;
    const isUppercaseValid = /[A-Z]/.test(password);
    const isNumberValid = /[0-9]/.test(password);
    const isSpecialValid = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Update requirement styles
    updateRequirementStatus(lengthRequirement, isLengthValid);
    updateRequirementStatus(uppercaseRequirement, isUppercaseValid);
    updateRequirementStatus(numberRequirement, isNumberValid);
    updateRequirementStatus(specialRequirement, isSpecialValid);

    // Hide the requirements if all conditions are met
    if (isLengthValid && isUppercaseValid && isNumberValid && isSpecialValid) {
        requirements.classList.add('hidden');
    } else {
        requirements.classList.remove('hidden');
    }
});

// Helper function to update the requirement styles
function updateRequirementStatus(element, isValid) {
    if (isValid) {
        element.classList.add('valid');
    } else {
        element.classList.remove('valid');
    }
}

function checkPasswordValidity(password) {
    return (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
}


function updateSubmitButtonState(formData) {
    const submitButton = document.getElementById("submit")
    const email = formData.get("email").trim();
    const username = formData.get("username").trim();
    const password = formData.get("password").trim();
    const cpassword = formData.get("cpassword").trim();

    // Check if any fields are empty
    if (email === "" || username === "" || password === "" || cpassword === "") {
        submitButton.classList.add('grayed');
        submitButton.disabled = true;
    }
    // Check if all fields are filled and password is valid
    else if (checkPasswordValidity(password) && password === cpassword) {
        submitButton.classList.remove('grayed');
        submitButton.disabled = false;
    } else {
        // Disable button if passwords don't match or are invalid
        submitButton.classList.add('grayed');
        submitButton.disabled = true;
    }
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
