// Essential libraries
const express = require('express');
const Router = require('express');
const session = require('express-session');
const form = require('../models/form.js');


const router = Router();
router.use(express.json());

router.use((req, res, next) => {
    res.locals.username = req.session.username || null;
    next();
});

const formController = require('../controllers/formController.js');


function isAuthenticated(req, res, next) {
    if (!req.session.username) {
        return res.redirect('/login');
    }
    next();
}

router.use("/dbview", isAuthenticated);


router.get('/', formController.getFrontPage);

router.get('/form/1', formController.getPage1);

router.get('/form/2', formController.getPage2);

router.get('/form/3', formController.getPage3);

router.get('/form/summary', formController.getFormSummary);

router.get('/form/4', formController.getPage4);

router.get('/dbview/calendar', formController.getCalendar);

router.get('/login', formController.getLogin);

router.get('/signup', formController.getSignUp);

router.get("/dbview", async (req, res) => {


    const bookingData = await form.find().sort({'formNumber' : -1});
    
    res.render("dbview", {
        title: "Database",
        bookings: bookingData,
        username: req.session.username
    })
});

router.get("/editdb", async (req, res) => {
    const bookingData = await form.find().sort({'formNumber' : -1});

    if (!req.session.username) {
        return res.redirect('/login');
    }

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

router.get('/status', formController.getFormStatus);

router.post("/checkAccount", formController.checkAccount);

router.post("/registerCheck", formController.registerCheck);

router.post("/logout", formController.destorySession);




module.exports = router;