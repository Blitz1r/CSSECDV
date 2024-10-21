// Essential libraries
const express = require('express');
const Router = require('express');

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

router.get("/dbview", (req, res) => {
    res.render("dbview", {
        title: "Database",
    })
});



module.exports = router;