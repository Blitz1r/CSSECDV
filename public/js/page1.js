// const testBtn = document.getElementById("test");


// testBtn.addEventListener("click", (e) => {
//     e.preventDefault();
//     let myObj = {}
//     const form1 = document.getElementById("page1-form");
//     const formData = new FormData(form1);

//     myObj["pickupRegion"] = formData.get("region");

//     const jString = JSON.stringify(myObj);

//     fetch("/submit-details", {
//         method: 'POST',
//         body: jString,
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//     .then(response => {
//         if (response.status === 200) {
//             alert("Good");
//         } else {
//             alert("Error.");
//         }
//     })
//     .catch(error => {
//         console.error("Request failed", error);
//         alert("An unexpected error occurred.");
//     });
// })

document.addEventListener("DOMContentLoaded", () => {
    const form1 = document.getElementById("page1-form");
    const form2 = document.getElementById("page2-form");
    const form3 = document.getElementById("page3-form");



    if(form1){
        form1.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(form1);
            let myObj = {}

            myObj["pickupRegion"] = formData.get("region");
            myObj["pickupCity"] = formData.get("city");
            myObj["pickupBarangay"] = formData.get("barangay");
            myObj["pickupStreet"] = formData.get("street");
            myObj["pickupBuilding"] = formData.get("building");
            myObj["pickupDate"] = formatDateString(formData.get("date"));
            myObj["pickupTime"] = convertMilitaryToStandard(formData.get("time"));
            myObj["pickupPassengers"] = formData.get("passengers");

            // Store myObj in localStorage as a JSON string
            localStorage.setItem("myFormData", JSON.stringify(myObj));
            
            // Redirect to another page
            window.location.href = '/page2';
        });
    }


    if(form2){
        form2.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(form2);


            const storedData = localStorage.getItem("myFormData");
            let myObj = {};

            if (storedData) {
                myObj = JSON.parse(storedData);
            }

            myObj["destinationRegion"] = formData.get("region");
            myObj["destinationCity"] = formData.get("city");
            myObj["destinationBarangay"] = formData.get("barangay");
            myObj["destinationBuilding"] = formData.get("building");
            myObj["departureDate"] = formatDateString(formData.get("departure-date"));
            myObj["departureTime"] = convertMilitaryToStandard(formData.get("departure-time"));
            if(formData.get("additional-info").trim != ""){
                myObj["departureAddInformation"] = formData.get("additional-info");
            }

            localStorage.setItem("myFormData", JSON.stringify(myObj));
            window.location.href = '/page3';
        });
    }

    if(form3){
        form3.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(form3);


            const storedData = localStorage.getItem("myFormData");
            let myObj = {};

            if (storedData) {
                myObj = JSON.parse(storedData);
            }

            if(formData.get("company-name").trim != ""){
                myObj["contactCompanyName"] = formData.get("company-name");
            };
            const countryCode = formData.get("country-code");
            const contactNumber = formData.get("contact-number");

            const fullContactNumber = `+${countryCode}${contactNumber}`;
            myObj["contactEmail"] = formData.get("email");
            myObj["contactNumber"] = fullContactNumber;


            // console.log(myObj);

            const jString = JSON.stringify(myObj);

            fetch("/submit-details", {
                method: 'POST',
                body: jString,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.status === 200) {
                    windows.location = "/page1";
                } else {
                    alert("Error.");
                }
            })
            .catch(error => {
                console.error("Request failed", error);
                alert("An unexpected error occurred.");
            });
        });
    }
});



function formatDateString(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;
}

function convertMilitaryToStandard(timeString) {
    let [hours, minutes] = timeString.split(':');
    hours = parseInt(hours);
  
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight and convert 13-23 to 1-11 for PM times
  
    return `${hours}:${minutes} ${period}`;
}