const express = require('express');
const router = express.Router();
const roomSchema = require('../models/RoomSchema.js');
const messageSchema = require('../models/MessageSchema.js');
const accountSchema = require('../models/AccountSchema.js');

// Add Room
router.post('/', async (req, res) => {
    console.log(req.body)
    try {
        const newRoom = new roomSchema({
            name: req.body.name,
            public: req.body.public,
            group: req.body.group,
            password: req.body.password,
            owner: req.body.owner
        });

        await newRoom.save()
            .then((result) => {
                return res.json(result);
            })
    } catch (err) {
        return res.json({ message: err.message });
    }
});

// Get Rooms List
router.get('/list', async (req, res) => {
    try {
        let rooms = req.query.rooms;

        if (rooms) {
            const list = await roomSchema.find({
                _id: { $in: rooms },
                group: true
            });

            return res.json(list);
        } else {
            throw 'List not found'
        }
    } catch (err) {
        return res.json(err.message);
    }
});

// Remove Room/Friend
router.delete('/:id', async (req, res) => {
    console.log('asdsa')
    try {
        let removeID = req.params.id;

        const room = await roomSchema.findById(removeID);

        if (!room.group) {
            let users = room.name.split("_");
            await accountSchema(
                { _id: { $in: users } },
                {}
            )
        }

        await roomSchema.findByIdAndDelete(removeID);
        await messageSchema.deleteMany({ room: removeID });

    } catch (err) {
        return res.json({ message: err.message });
    }
    return res.json({ message: 'Complete' })
});


module.exports = router;