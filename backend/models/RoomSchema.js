const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    public: {
        type: Boolean,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    group: {
        type: Boolean,
        required: false,
        default: true,
    },
    owner: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Rooms', roomSchema);