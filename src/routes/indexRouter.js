// Essential libraries
const express = require('express');
const Router = require('express');

const form = require('../models/form.js');

const router = Router();

const formController = require('../controllers/formController.js');


router.get('/', formController.getFrontPage);

router.get('/form/1', formController.getPage1);

router.get('/form/2', formController.getPage2);

router.get('/form/3', formController.getPage3);

router.get('/form/summary', formController.getFormSummary);

router.get('/form/4', formController.getPage4);

router.get('/dbview/calendar', formController.getCalendar);

router.get('/dbview/login', formController.getLogin);

router.get('/dbview/signup', formController.getSignUp);

router.get("/dbview", async (req, res) => {
    const bookingData = await form.find().sort({'formNumber' : -1});
    
    res.render("dbview", {
        title: "Database",
        bookings: bookingData,
    })
});

router.get("/editdb", async (req, res) => {
    const bookingData = await form.find().sort({'formNumber' : -1});

    res.render("editdb", {
        title: "Edit Database",
        bookings: bookingData,
    })
});

router.post('/editdb', formController.filterView);

router.post('/getFormData', formController.getFormData);

router.get('/editdb/:id/edit', formController.loadEditSelected);

router.post('/editdb/:id/edit', formController.postEditSelected);

router.post('/editdb/delete', formController.deleteSelected);

router.post("/submit-details", formController.submit_details);


module.exports = router;