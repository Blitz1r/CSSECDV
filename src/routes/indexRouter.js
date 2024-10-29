// Essential libraries
const express = require('express');
const Router = require('express');

const form = require('../models/form.js');

const router = Router();

const formController = require('../controllers/formController.js');


router.get("/", (req, res) => {
    res.render("page1", {
        title: "Page 1",
    })
});

router.get('/page1', formController.getPage1);

router.get('/page2', formController.getPage2);

router.get('/page3', formController.getPage3);

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

router.post('/editdb/filter', formController.filterView);

router.post('/editdb/delete', formController.deleteSelected);

router.post("/submit-details", formController.submit_details);


module.exports = router;