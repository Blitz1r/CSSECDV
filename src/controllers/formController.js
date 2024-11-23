const mongoose = require('mongoose');
const Form = require('../models/form.js');

//const { formatInTimeZone } = require('date-fns-tz');

const formController = { 

    // convertTo24Hour(timeString) {
    //     let date = new Date(`01/01/2022 ${timeString}`);
    //     let options = { hour: '2-digit', minute: '2-digit', hour12: false };
    //     let formattedTime = new Intl.DateTimeFormat('en-GB', options).format(date);
    //     return formattedTime;
    // },
    getFrontPage: (req, res) => {
        res.render("frontPage", {
            title: "Front Page",
        });
    },

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

    getPage4: (req, res) => {
        res.render("page4", {
            title: "Submission Success!",
        })
    },

    getFormSummary: (req, res) => {
        res.render("formSummary", {
            title: "Form Summary",
        })
    },

    getCalendar: (req, res) => {
        Form.find() 
        .then(forms => {
            // console.log(forms);
            res.render("calendar", {
                title: "Calendar View",
                forms: forms || []  
            });
        })
        .catch(error => {
            console.error('Error fetching forms:', error);
            res.status(500).send("Error fetching forms");
        });
    },

    async filterView (req, res) {
        try {
            const { sortOptions, fromDate, toDate, search } = req.body;
            console.log(req.body);

            let query = {};
            if (fromDate || toDate) {
                query.pickupDate = {};
                if (fromDate) {
                    const timeZone = 'Asia/Manila'; 
                    const zonedDate = formatInTimeZone(fromDate, timeZone, 'MM/dd/yyyy'); // HH:mm:ss
                    query.pickupDate.$gte = new Date(zonedDate);
                }
                if (toDate) {
                    const timeZone = 'Asia/Manila'; 
                    const zonedDate = formatInTimeZone(toDate, timeZone, 'MM/dd/yyyy');
                    query.pickupDate.$lte = new Date(zonedDate);
                }
            }
    
            if (search) {
                let trimmedSearch = search.trim().replace(/\s+/g, ' ');
            
                const searchDate = new Date(trimmedSearch);
            
                if (!isNaN(searchDate.getTime())) {
                    const timeZone = 'Asia/Singapore';
            
                    const startOfDay = new Date(searchDate.toLocaleString('en-US', { timeZone }));
                    startOfDay.setHours(0, 0, 0, 0); 
            
                    const endOfDay = new Date(startOfDay);
                    endOfDay.setHours(23, 59, 59, 999);  
            
                    query.$or = [
                        {
                            pickupDate: {
                                $gte: startOfDay, 
                                $lte: endOfDay   
                            }
                        },
                        {
                            departureDate: {
                                $gte: startOfDay, 
                                $lte: endOfDay   
                            }
                        }
                    ];
                } else {
                    const escapeRegex = (str) => {
                        return str.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&'); 
                    };
            
                    const escapedSearch = escapeRegex(trimmedSearch); 
                    query.$or = [
                        { pickupAddress: { $regex: escapedSearch, $options: 'i' } },
                        { contactCompanyName: { $regex: escapedSearch, $options: 'i' } },
                        { destinationAddress: { $regex: escapedSearch, $options: 'i' } },
                        { contactNumber: { $regex: escapedSearch, $options: 'i' } }, 
                        { contactEmail: { $regex: escapedSearch, $options: 'i' } }
                    ];
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

    async loadEditSelected (req, res) {
        try {
            const id = req.params.id; 
            console.log('id:', id); 
            if (!id) {
                return res.status(400).send('id is missing');
            }
            const form = await Form.findById({_id:id});

            console.log(form);
            res.render('editPage', {editForm:form});

            //res.redirect(req.get('Referrer') || '/editdb');
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    async postEditSelected (req, res) {
        try {
            const id = req.params.id;
            console.log(req.body);
            
            const updatedData = {
                pickupAddress,
                destinationAddress,
                pickupDate,
                pickupTime,
                pickupPassengers,
                departureDate,
                departureTime,
                contactCompanyName,
                pickupPassengers,
                contactNumber,
                contactEmail,
                departureAddInformation
            } = req.body;

            const form = await Form.findById(id); 
            if (!form) {
                return res.status(404).send('Form not found');
            }

            // Update the form data
            await Form.updateOne({ _id: id }, updatedData);

            console.log('Form updated successfully:', updatedData);
            res.redirect(req.get('Referrer') || '/editdb/:id/edit');
            
        } catch (error) {
            return res.sendStatus(404);
        }
        
    },


    async deleteSelected (req, res) {
        try {
            const ids = req.body.ids; 
            const formNumber = req.body.formNumber; 
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

            // console.log("form Data: ", formData);

            try {
                // Create a new user instance with the constructed user object
                await Form.create(formData);
                console.log('Form created successfully:', formData)
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