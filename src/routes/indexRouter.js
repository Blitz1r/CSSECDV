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
        title: "Page 1",
    })
});

router.get("/page2", (req, res) => {
    res.render("page2", {
        title: "Page 2",
    })
});

router.get("/page3", (req, res) => {
    res.render("page3", {
        title: "Page 3",
    })
});



module.exports = router;