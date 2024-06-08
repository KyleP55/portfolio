const express = require('express');
const router = express.Router();
const roomSchema = require('../models/RoomSchema.js');

// Add Room
router.post('/', async (req, res) => {
    try {
        const newRoom = new roomSchema({
            name: req.body.name,
            public: req.body.public,
            password: req.body.password,
            owner: req.body.owner
        });

        await newRoom.save()
            .then((result) => {
                return res.json(result);
            })
    } catch (err) {
        return res.json({ message: "Error Adding Room" });
    }
});

// Get Rooms List
router.get('/list', async (req, res) => {
    try {
        let rooms = req.query.rooms;

        if (rooms) {
            const list = await roomSchema.find({
                _id: { $in: rooms }
            });

            return res.json(list);
        } else {
            throw 'List not found'
        }
    } catch (err) {
        return res.json(err.message);
    }
});

module.exports = router;