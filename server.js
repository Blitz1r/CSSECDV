//* =========Libraries=========
require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');  
const connectToMongo = require('./src/scripts/conn.js'); // Import function to connect to MongoDB
const populateDatabase = require('./src/scripts/populateDatabase.js'); // Import function to populate database
const session = require('express-session');
//* ===========================

//* ==========Routers==========
const router = require('./src/routes/indexRouter.js'); // Import the main router
//* ===========================

const server = express();
var port = process.env.PORT || 3000;

server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1209600000} // 2 weeks in milliseconds
}));

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('ifCond', function(v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});
server.set('view engine', 'hbs');
server.use(express.static(path.join(__dirname, 'public')));
server.set('views', path.join(__dirname, 'views'));
server.use(bodyParser.json()); 
server.use(bodyParser.urlencoded({ extended: true })); 
server.use(router);




async function database() {
    try {
        await connectToMongo();
        await populateDatabase();
    } catch (error) {
        console.error('Server: Failed to start server', error);
    }
}

server.listen(port, async function() {
    await database(); //! Comment this out so no sample data will be filled.
    console.log(`Server: Running on http://localhost:${port}`);
});