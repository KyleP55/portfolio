const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    nameSpace: {
        type: String,
        require: true,
    },
    message: {
        type: String,
        require: true,
    },
    sender: {
        type: String,
        require: true
    },
    date: {
        type: String,
        require: true
    },
    read: {
        type: Boolean,
        require: true,
        default: false
    }
});

module.exports = mongoose.model('Messages', messageSchema);