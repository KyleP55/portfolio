const express = require('express');
const router = express.Router();
const roomSchema = require('../models/RoomSchema.js');

// Add Room
router.post('/', async (req, res) => {
    try {
        const newRoom = new roomSchema({
            name: req.body.name,
            public: req.body.public,
            password: req.body.password
        });

        await newRoom.save()
            .then((result) => {
                return res.json(result);
            })
    } catch (err) {
        console.log('Error adding room.');
        console.log(err)
        return res.json({ message: "Error Adding Room" });
    }
});

// Get Rooms List
router.get('/list', async (req, res) => {
    console.log('in list')
    try {
        roomSchema.find({ _id: req.body.id })
            .then((x) => {
                return res.json(x);
            });
    } catch (err) {
        return res.json(x);
    }
});

module.exports = router;