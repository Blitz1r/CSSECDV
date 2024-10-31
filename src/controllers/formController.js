const mongoose = require('mongoose');
const Form = require('../models/form.js');

const formController = { // Added the equal sign here
    
    getPage1: (req, res) => {
        res.render("page1", {
            title: "Pick-up Information",
        });
    },

    getPage2: (req, res) => {
        res.render("page2", {
            title: "Departure Information",
        })
    },
    
    getPage3: (req, res) => {
        res.render("page3", {
            title: "Contact Information",
        })
    },

    async filterView (req, res) {
        try {
            const { sortOptions, fromDate, toDate } = req.body;
            console.log(req.body);

            let query = {};
            if (fromDate || toDate) {
                query.pickupDate = {};
                if (fromDate) {
                    query.pickupDate.$gte = new Date(fromDate);
                }
                if (toDate) {
                    query.pickupDate.$lte = new Date(toDate);
                }
            }
    
            let sort = {};
            if (sortOptions === 'newestFormNumber') {
                sort.formNumber = -1; 
            } else if (sortOptions === 'oldestFormNumber') {
                sort.formNumber = 1;
            } else if (sortOptions === 'newestPickupDate') {
                sort.pickupDate = 1;
            } else if (sortOptions === 'oldestPickupDate') {
                sort.pickupDate = -1;
            }

            const forms = await Form.find(query).sort(sort);
            //to test when session comes

            //req.session.bookings = forms;

            //res.redirect('back');
    
            res.render('editdb', { bookings: forms });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    async deleteSelected (req, res) {
        try {
            const ids = req.body.ids; // Access ids safely
            const formNumber = req.body.formNumber; // Access ids safely
            if (!ids) {
                return res.status(400).send('ids is missing');
            }

            await Form.deleteMany({ _id: { $in: ids } });
        
            console.log('Form deleted successfully:', ids);

            res.redirect(req.get('Referrer') || '/editdb');
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    async submit_details (req, res) {
        try {
            const {
                pickupRegion,
                pickupCity,
                pickupBarangay,
                pickupStreet,
                pickupBuilding,
                pickupDate,
                pickupTime,
                pickupPassengers,
                destinationRegion,
                destinationCity,
                destinationBarangay,
                destinationBuilding,
                departureDate,
                departureTime,
                departureAddInformation,
                contactCompanyName,
                contactEmail,
                contactNumber
            } = req.body;
            
            const formNumber = await Form.countDocuments() + 1;
            
            const formData = {
                formNumber: formNumber,
                pickupRegion: pickupRegion,
                pickupCity: pickupCity,
                pickupBarangay: pickupBarangay,
                pickupStreet: pickupStreet,
                pickupBuilding: pickupBuilding,
                pickupDate: pickupDate,
                pickupTime: pickupTime,
                pickupPassengers: pickupPassengers,
                destinationRegion: destinationRegion,
                destinationCity: destinationCity,
                destinationBarangay: destinationBarangay,
                destinationBuilding: destinationBuilding,
                departureDate: departureDate,
                departureTime: departureTime,
                departureAddInformation: departureAddInformation,
                contactCompanyName: contactCompanyName,
                contactEmail: contactEmail,
                contactNumber: contactNumber
            };

            if(departureAddInformation.trim() !== "" && departureAddInformation){
                formData.departureAddInformation = departureAddInformation;
            }

            try {
                // Create a new user instance with the constructed user object
                await Form.create(formData);

                // Respond with a sendStatus code and message
                return res.sendStatus(201);
            } catch (creationError) {
                console.error('Error:', creationError);
                return res.sendstatus(500);
            }
            
        } catch (error) {
            return res.sendStatus(404);
        }
        
    },
};

module.exports = formController;