const mongoose = require('mongoose');


const companySchema = new mongoose.Schema({
    companyID: { // 0001, 0002, 0003, ... , XXXX
        type: Number,
        required: true,
        unique: true
    },
    companyName: { // Userame of the review
        type: String,
        trim: true,
        unique: true
    },
    deleted: {
        type: Boolean,
        default: 0
    }
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;