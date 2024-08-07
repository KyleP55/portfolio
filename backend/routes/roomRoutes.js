const express = require('express');
const router = express.Router();
const roomSchema = require('../models/RoomSchema.js');
const messageSchema = require('../models/MessageSchema.js');
const accountSchema = require('../models/AccountSchema.js');
const notificationSchema = require('../models/NotificationSchema.js');

// Add Room
router.post('/', async (req, res) => {
    try {
        const newRoom = new roomSchema({
            name: req.body.name,
            public: req.body.public,
            group: req.body.group,
            password: req.body.password,
            owner: req.body.owner
        });


        const result = await newRoom.save();
        delete result.password

        await accountSchema.findByIdAndUpdate(
            req.body.owner,
            { $push: { rooms: result._id } }
        );

        return res.json(result);
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
    } catch (err) {
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

        if (room) {
            // Join if public
            // if (room.public == true) {

            //     await accountSchema.findByIdAndUpdate(
            //         { _id: req.userData.id },
            //         { $push: { rooms: room._id } },
            //         { new: true },
            //         { rooms: 1 }
            //     ).then((r) => {
            //         return res.json({ message: 'Joined Room' });
            //     });
            // }

            return res.json({ message: 'Joined Room' });

            // Send request to owner if private
            const newNotification = new notificationSchema({
                account: room.owner,
                type: 'Join Room Request',
                message: req.userData.userName + ' would like to join your private room ' + name,
                from: req.userData.id
            })

            await newNotification.save();

            return res.json({ message: 'Request Sent' });
        }

        return res.json({ errorMessage: 'No Rooms Found' });
    } catch (err) {
        return res.json(err.message);
    }
});

// Get Rooms List
router.get('/list', async (req, res) => {
    try {
        let rooms = req.query.rooms;

        if (rooms) {
            const list = await roomSchema.find(
                {
                    _id: { $in: rooms },
                    group: true
                },
                {
                    _id: 1,
                    group: 1,
                    name: 1,
                    public: 1,
                    owner: 1
                }
            );

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
            // Private Convos
            let users = room.name.split("_");

            let accounts = await accountSchema.find(
                { _id: { $in: users } },
                { friends: 1, rooms: 1, _id: 1, userName: 1 }
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

                await roomSchema.findByIdAndDelete(removeID);
                await messageSchema.deleteMany({ room: removeID });
            } else {
                return res.json({ message: "Couldn't find account" });
            }
        } else {
            // Room Group
            if (room.owner === req.userData.id) {
                await accountSchema.updateMany(
                    { rooms: { $in: removeID } },
                    { $pull: { rooms: removeID } }
                );
                console.log('deleeting')

                await roomSchema.findByIdAndDelete(removeID)
                    .then((a) => console.log(a))
                await messageSchema.deleteMany({ room: removeID });
            } else {
                await accountSchema.findByIdAndUpdate(
                    req.userData.id,
                    { $pull: { rooms: removeID } }
                );

                console.log('deleeting1')
            }
        }

        if (room.owner === req.userData.id) {

        }

        return res.json({ message: 'completed' });

    } catch (err) {
        return res.json({ message: err.message });
    }
    return res.json({ message: 'Complete' })
});


module.exports = router;