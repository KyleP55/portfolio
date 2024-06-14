const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    account: {
        type: String,
        require: true,
    },
    type: {
        type: String,
        require: true,
    },
    message: {
        type: String,
        require: true,
    },
    date: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('Notifications', notificationSchema);