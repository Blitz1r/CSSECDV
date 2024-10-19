// Essential libraries
const express = require('express');
const Router = require('express');

const router = Router();


router.get("/", (req, res) => {
    res.render("page1", {
        title: "Page 1",
    })
});

router.get("/page1", (req, res) => {
    res.render("page1", {
        title: "Pick-up Information",
    })
});

router.get("/page2", (req, res) => {
    res.render("page2", {
        title: "Departure Information",
    })
});

router.get("/page3", (req, res) => {
    res.render("page3", {
        title: "Contact Information",
    })
});



module.exports = router;