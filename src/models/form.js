const mongoose = require('mongoose');

const { formatInTimeZone } = require('date-fns-tz');

const formSchema = new mongoose.Schema({
    //Pick-up Informatiom
    formNumber: { 
        type: Number,
        required: true,
        unique: true
    },
    pickupRegion: { 
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
    pickupAddress: { //! This doesnt need to be done manually
        type: String,
    },
    pickupDate: { 
        type: Date,
        required: true,
        get: (date) => {
            if (!date) return date;
            const timeZone = 'Asia/Manila'; 
            const zonedDate = formatInTimeZone(date, timeZone, 'MM/dd/yyyy'); //HH:mm:ss
            return zonedDate;
            
            //const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            //return new Intl.DateTimeFormat('en-US', options).format(new Date(zonedDate));
        }
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

    //Destination Information
    destinationAddress:{ //! This doesnt need to be done manually
        type: String,
    },    

    destinationRegion: { 
        type: String,
        required: true
    },
    destinationCity: { 
        type: String,
        required: true
    },
    destinationBarangay: { 
        type: String,
        required: true
    },
    destinationBuilding: { 
        type: String,
        required: true
    },
    departureDate: { 
        type: Date,
        required: true,
        get: (date) => {
            if (!date) return date;
            const timeZone = 'Asia/Manila'; 
            const zonedDate = formatInTimeZone(date, timeZone, 'MM/dd/yyyy'); //HH:mm:ss
            return zonedDate;
            
            //const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            //return new Intl.DateTimeFormat('en-US', options).format(new Date(zonedDate));
        }
    },
    departureTime: { 
        type: String,
        required: true
    },
    departureAddInformation: { 
        type: String
    },   

    //Contact Information
    contactCompanyName: { 
        type: String,
        default: "N/A"
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

formSchema.pre('save', function (next) {
    // Concatenate address fields into one string
    this.destinationAddress = `${this.destinationBuilding}, ${this.destinationBarangay}, ${this.destinationCity}, ${this.destinationRegion}`;
    next();
});

formSchema.pre('save', function (next) {
    // Concatenate address fields into one string
    this.pickupAddress = `${this.pickupBuilding}, ${this.pickupStreet}, ${this.pickupBarangay}, ${this.pickupCity}, ${this.pickupRegion}`;
    next();
});

const FormData = mongoose.model('FormData', formSchema);

module.exports = FormData;