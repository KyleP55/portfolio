const express = require('express');
const router = express.Router();
const messageSchema = require('../models/MessageSchema.js');

// Get all from NameSpace
router.get('/:nameSpace/', async (req, res) => {
    try {
        const nameSpace = req.params.nameSpace;

        const messages = await messageSchema.find({ nameSpace: nameSpace });

        res.status(200).json(messages);
    } catch (err) {
        console.log(err);
        res.json(err);
    }
});

// Write a message
router.post('/', async (req, res) => {
    console.log('should be saving message')
    try {
        const b = req.body;

        const newMessage = new messageSchema({
            nameSpace: b.nameSpace,
            message: b.message,
            sender: b.sender,
            date: b.date,
            read: false
        });
        console.log('should be here')

        const res = await newMessage.save();
        console.log(res)
        res.json(res);
    } catch (err) {
        res.json(err);
    }
});

module.exports = router;