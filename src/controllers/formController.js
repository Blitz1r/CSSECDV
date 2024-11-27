const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const crypto = require('crypto');

const Form = require('../models/form.js');
const Account = require('../models/account.js');


const { formatInTimeZone } = require('date-fns-tz');

function generateReferenceCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(characters.length);
        text += characters.charAt(randomIndex);
    }
    return text;
}

async function hashPassword(password){
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
      } catch (error) {
        console.error('Error hashing password:', error);
      }
}

async function checkPassword(sentPassword, passwordFromDB) {
    try {
        return await bcrypt.compare(sentPassword, passwordFromDB);
    } catch (error) {
        console.error('Error comparing passwords:', error);
        return false;
    }
}




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
            referenceCode: referenceCode,
        })
    },

    getFormSummary: (req, res) => {
        res.render("formSummary", {
            title: "Form Summary",
        })
    },

    getCalendar: (req, res) => {
        res.render("calendar", {
            title: "Calendar View",
        });
    },

    getLogin: (req, res) => {
        res.render("login", {
            title: "Log in",
        })
    },

    getSignUp: (req, res) => {
        res.render("signup", {
            title: "Sign up",
        })
    },

    async filterView (req, res) {
        try {
            const { dateOptions, fromDate, toDate, search } = req.body;
            console.log(req.body);

            let query = {};
            if (fromDate || toDate) {
                if (dateOptions === 'pickupDate'){
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
                } else if (dateOptions === 'departureDate') {
                    query.departureDate = {};
                    if (fromDate) {
                        const timeZone = 'Asia/Manila'; 
                        const zonedDate = formatInTimeZone(fromDate, timeZone, 'MM/dd/yyyy');
                        query.departureDate.$gte = new Date(zonedDate);
                    }
                    if (toDate) {
                        const timeZone = 'Asia/Manila'; 
                        const zonedDate = formatInTimeZone(toDate, timeZone, 'MM/dd/yyyy');
                        query.departureDate.$lte = new Date(zonedDate);
                    }
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
                        { referenceCode: { $regex: escapedSearch, $options: 'i' } },
                        { pickupAddress: { $regex: escapedSearch, $options: 'i' } },
                        { contactCompanyName: { $regex: escapedSearch, $options: 'i' } },
                        { destinationAddress: { $regex: escapedSearch, $options: 'i' } },
                        { contactNumber: { $regex: escapedSearch, $options: 'i' } }, 
                        { contactEmail: { $regex: escapedSearch, $options: 'i' } }
                    ];
                }
            }

            const forms = await Form.find(query);
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

    async getFormData(req, res){
        try {
            const forms = await Form.find({});

            res.status(200).json(forms);
        } catch (error) {
            res.Status(500).json({ message: 'Server error' });
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

            uniqueCode = false;
            referenceCode = "";
            
            while (!uniqueCode) {
                referenceCode = generateReferenceCode(10);
                existingForm = await Form.findOne({ referenceCode: referenceCode });
                if (!existingForm) {
                    uniqueCode = true;
                }
            }

            console.log('Generated Reference Code:', referenceCode);

            const formData = {
                formNumber: formNumber,
                referenceCode: referenceCode,
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
                // Create a new form in the database
                await Form.create(formData);

                return res.status(201).json({ referenceCode: referenceCode });
            } catch (creationError) {
                console.error('Error:', creationError);
                return res.sendStatus(500);
            }
            
        } catch (error) {
            return res.sendStatus(404);
        }
        
    },

    async getFormStatus(req, res) {
        try {
            const referenceCode = req.query.refCode;
            const form = await Form.findOne({ referenceCode: referenceCode });
            if (form) {
                res.render('formStatus', { form: form });
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            console.error(error);
            res.sendStatus(500);
        }
    },

    async checkAccount(req, res) {
        try {
            const username = req.body.username;
            const password = req.body.password;
    
            const account = await Account.findOne({ username: username });
            if (account) {
                // Await the checkPassword function
                if (await checkPassword(password, account.password)) {
                    req.session.username = req.body.username;

                    res.sendStatus(200); // OK - Credentials are valid
                } else {
                    res.sendStatus(401); // Unauthorized - Incorrect password
                }
            } else {
                res.sendStatus(404); // Not Found - Account does not exist
            }
        } catch (error) {
            console.error(error);
            res.sendStatus(500); // Internal Server Error - Something went wrong
        }
    },
    async registerCheck(req, res){
        try {
            const email = req.body. email;
            const username = req.body.username;
            let password = req.body.password;

            const userCheck = await Account.findOne({ username: { $regex: `^${username}$`, $options: 'i' } });
            const emailCheck = await Account.findOne({ email: { $regex: `^${email}$`, $options: 'i' } });

            if (userCheck || emailCheck) {
                return res.sendStatus(409).json({ error: "Account already exists" });
            }
            
            password = await hashPassword(password);
            const accountData = {
                email: email,
                username: username,
                password: password,
                deleted: 0
            }

            const account = new Account(accountData);
            await account.save();

            res.status(201).json({ message: "Account created successfully" });
        } catch (error) {
            console.error(error);
            res.sendStatus(500);
        }
    },
    async setSession(req, res){
    },
    // async destorySession(req, res){
    //     req.session.destroy((err) => {
    //         if (err) {
    //             return res.status(500).send('Failed to destroy session');
    //         }
    
    //         res.clearCookie('connect.sid');
    //         res.send('Session destroyed and cookie cleared');
    //     });  
    // },
};

module.exports = formController;