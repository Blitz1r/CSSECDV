//* =========Libraries=========
require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const connectToMongo = require('./src/scripts/conn.js'); // Import function to connect to MongoDB
const populateDatabase = require('./src/scripts/populateDatabase.js'); // Import function to populate database
//* ===========================

//* ==========Routers==========
const router = require('./src/routes/indexRouter.js'); // Import the main router
//* ===========================

const server = express();
var port = process.env.PORT || 3000;


server.set('view engine', 'hbs');
server.use(express.static(path.join(__dirname, 'public')));
server.set('views', path.join(__dirname, 'views'));
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
    await database();
    console.log(`Server: Running on http://localhost:${port}`);
});