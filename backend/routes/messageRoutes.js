const express = require('express');
const router = express.Router();
const messageSchema = require('../models/MessageSchema.js');

// Get all from NameSpace
router.get('/:room/', async (req, res) => {
    try {
        const room = req.params.room;
        const messages = await messageSchema.find({ room: room });

        res.status(200).json(messages);
    } catch (err) {
        console.log(err);
        res.json(err);
    }
});

// Write a message
router.post('/', async (req, res) => {
    try {
        const b = req.body;

        const newMessage = new messageSchema({
            room: b.room,
            message: b.message,
            sender: b.sender,
            date: b.date,
            read: false
        });

        const res = await newMessage.save();
        res.json(res);
    } catch (err) {
        res.json(err);
    }
});

// Delete all messages
router.delete('/', async (req, res) => {
    try {
        await messageSchema.deleteMany().then(() => {
            console.log('should be cleared');
        })
        res.status(200);
    } catch (err) {
        res.json(err);
    }
});

module.exports = router;