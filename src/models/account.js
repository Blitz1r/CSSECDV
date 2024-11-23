const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    deleted: {
        type: Boolean,
        default: 0
    }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;