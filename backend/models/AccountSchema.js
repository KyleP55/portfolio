const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true
    },
    userName: {
        type: String,
        require: true
    },
    accountRoll: {
        type: String,
        require: false,
        default: 'User'
    }
});

module.exports = mongoose.model('Accounts', accountSchema);