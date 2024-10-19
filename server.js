//* =========Libraries=========
require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('hbs');
//* ===========================

//* ==========Routers==========
// const router = require('./src/routes/indexRouter.js'); // Import the main router
//* ===========================



const server = express();
var port = process.env.PORT || 3000;


server.set('view engine', 'hbs');

server.use(express.static(path.join(__dirname, 'public')));

server.set('views', path.join(__dirname, 'views'));

server.get("/", (req, res) => {
    res.render("page1", {
        title: "Page 1",
    })
});

server.get("/page1", (req, res) => {
    res.render("page1", {
        title: "Page 1",
    })
});

server.get("/page2", (req, res) => {
    res.render("page2", {
        title: "Page 2",
    })
});

server.get("/page3", (req, res) => {
    res.render("page3", {
        title: "Page 3",
    })
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });