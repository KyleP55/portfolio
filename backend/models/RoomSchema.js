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
    }
});

module.exports = mongoose.model('Rooms', roomSchema);