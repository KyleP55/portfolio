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

// Get Public Rooms
router.get('/public', async (req, res) => {
    try {
        const list = await roomSchema.find({
            public: true
        });

        return res.json(list);
    } catch(err) {
        return res.json(err.message);
    }
});

// Search for Room
router.get('/search/:name', async (req, res) => {
    const name = req.params.name;
    try {
        const room = await roomSchema.findOne({
            name: name
        });

        if (room) return res.json(room);

        return res.json({ message: 'No Rooms Found' });
    } catch(err) {
        return res.json(err.message);
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
    try {
        let removeID = req.params.id;
        
        const room = await roomSchema.findById(removeID);
        
        if (!room.group) {
            let users = room.name.split("_");
            console.log(users)
            let accounts = await accountSchema.find(
                { _id: { $in: users } },
                {friends: 1, rooms: 1, _id: 1, userName: 1}
            );
            
            if (accounts) {
                accounts.forEach((account) => {
                    let updatedFriendsList = [...account.friends];
                    let updatedRoomsList = [...account.rooms];

                    account.friends.forEach((friend, i) => {
                        if (friend === users[0] || friend === users[1]) {
                            updatedFriendsList.splice(i, 1);
                        }
                    });
                    account.rooms.forEach((room, i) => {
                        if (room === removeID) {
                            updatedRoomsList.splice(i, 1);
                        }
                    });

                    accountSchema.updateOne(
                        { _id: account._id },
                        { 
                            friends: [...updatedFriendsList], 
                            rooms: [...updatedRoomsList] 
                        }
                    );
                });
            } else {
                return res.json({ message: "Couldn't find account" });
            }
        }

        await roomSchema.findByIdAndDelete(removeID);
        await messageSchema.deleteMany({ room: removeID });

    } catch (err) {
        return res.json({ message: err.message });
    }
    return res.json({ message: 'Complete' })
});


module.exports = router;