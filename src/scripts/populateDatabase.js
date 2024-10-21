const mongoose = require('mongoose');
const connectToMongo = require('./conn.js');
const form = require('../models/form.js');


const sampleFormData = require('./sampleData/sampleFormData.js');

async function dropDatabase() {
    try {
        await mongoose.connection.dropDatabase();
        console.log('Database: Old DB Dropped successfully');
    } catch (error) {
        console.error('Database: Error dropping database', error);
    }
}


async function populateDatabase() {
    try {
        await dropDatabase();

        for (const formData of sampleFormData) {
            const FormData = new form(formData);
            await FormData.save();
        }

        console.log('Database: Population function completed');
    } catch (error) {
        console.error('Database: Error populating database', error);
    }
}

module.exports = populateDatabase;