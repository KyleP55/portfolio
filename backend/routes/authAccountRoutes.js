const express = require('express');
const router = express.Router();
const accountSchema = require('../models/AccountSchema.js');
const roomSchema = require('../models/RoomSchema.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'Q7BljLhFTh04xTR7F4xQCB3tsj7saogd'

// Get Context Info
router.get('/context', async (req, res) => {
    try {
        const id = req.userData.id;

        const account = await accountSchema.findOne({ _id: id }, { email: 1, userName: 1, _id: 1, rooms: 1, friends: 1 });

        if (account == undefined) return res.json({ message: "User not found" });

        return res.json(account);
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
});

// Get Rooms
router.get('/roomsfriends', async (req, res) => {
    try {
        const id = req.userData.id;

        await accountSchema.findOne({ _id: id }, { rooms: 1, friends: 1 })
            .then((res) => {
                res.json(res);
            });
    } catch (err) {
        res.json(err);
    }
});

// Join Room
router.post('/joinRoom', async (req, res) => {
    try {
        const roomsList = await accountSchema.findByIdAndUpdate(
            req.body._id,
            { $push: { rooms: req.body.roomID } },
            { new: true }
        );

        const room = await roomSchema.findById(req.body.roomID);

        return res.json(room);

    } catch (err) {
        return res.json({ message: err.message });
    }
});

// Leave Room
router.delete('/leaveRoom/:id', async (req, res) => {
    try {
        let updatedRooms = await accountSchema.findById(req.userData.id);
        if (!updatedRooms) return res.json({ message: "Account not found" });

        updatedRooms.rooms.forEach((r, i) => {
            if (r === req.params.id) updatedRooms.rooms.splice(i, 1);
        });

        await accountSchema.findByIdAndUpdate(
            req.userData.id,
            { rooms: [...updatedRooms.rooms] },
            { new: true }
        ).then((r) => {
            return res.json(r.rooms);
        });
    } catch (err) {
        console.log(err.message);
        return res.json({ message: err.message });
    }
});

// Add Friend
router.post('/friends', async (req, res) => {
    try {
        await accountSchema.findByIdAndUpdate(
            { _id: req.body.id },
            { $push: { friends: req.body.name } },
            { new: true }
        ).then((r) => {
            return res.status(200);
        })

    } catch (err) {
        return res.json({ message: err.message });
    }
});

// Get Friends List
router.get('/friends', async (req, res) => {
    try {
        let re = new RegExp(`${req.query.id}`);
        let rooms = await roomSchema.find(
            {
                group: false,
                name: { $regex: re }
            }
        );

        await accountSchema.find(
            { _id: req.query.id },
            { friends: 1 }
        ).then((r) => {
            accountSchema.find(
                { _id: { $in: r[0].friends } },
                { _id: 1, userName: 1 }
            ).then((r2) => {
                let friendsList = [];
                rooms.forEach((room) => {
                    r2.forEach((friend, i) => {
                        if (room.name.replace(re, "").replace("_", "") == friend._id) {
                            let newFriend = {
                                _id: room._id,
                                userName: friend.userName,
                                friendID: friend._id
                            }

                            friendsList.push(newFriend);
                        }
                    });
                });
                return res.json(friendsList);
            });
        })
    } catch (err) {
        return res.json({ message: err.message });
    }
});

//Generate Token
function generateToken(sig) {
    return jwt.sign(sig, jwtSecret, { expiresIn: '60s' });
}

module.exports = router;