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
    },
    rooms: {
        type: [String],
        default: ['66632d638777e339d560e413']
    },
    friends: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model('Accounts', accountSchema);