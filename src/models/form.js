const mongoose = require('mongoose');


const formSchema = new mongoose.Schema({
    //Pick-up Informatiom
    formID: { 
        type: Number,
        required: true,
        unique: true
    },
    pickupProvince: { 
        type: String,
        required: true
    },
    pickupCity: { 
        type: String,
        required: true
    },
    pickupBarangay: { 
        type: String,
        required: true
    },
    pickupStreet: { 
        type: String,
        required: true
    },
    pickupBuilding: { 
        type: String,
        required: true
    },
    pickupDate: { 
        type: Date,
        required: true
    },
    pickupTime: { 
        type: String,
        required: true
    },
    pickupPassengers: {
        type: Number,
        min: 1,
        required: true
    },

    //Departure Information
    departureDestination: { 
        type: String,
    },
    departureProvince: { 
        type: String,
        required: true
    },
    departureCity: { 
        type: String,
        required: true
    },
    departureBarangay: { 
        type: String,
        required: true
    },
    departureBuilding: { 
        type: String,
        required: true
    },
    departureDate: { 
        type: Date,
        required: true
    },
    departureTime: { 
        type: String,
        required: true
    },
    departureReturnDate: { 
        type: Date
    },
    departureAddInformation: { 
        type: String
    },

    //Contact Information
    contactCompanyName: { 
        type: String
    },
    contactPerson: {
        type: String,
        required: true
    },
    contactEmail: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },

    deleted: {
        type: Boolean,
        default: 0
    }
});

const FormData = mongoose.model('FormData', formSchema);

module.exports = FormData;