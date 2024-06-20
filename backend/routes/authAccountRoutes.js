const express = require('express');
const router = express.Router();
const accountSchema = require('../models/AccountSchema.js');
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
        console.log(err)
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

// Add Friend
router.post('/friends/', async (req, res) => {
    try {
        await accountSchema.findByIdAndUpdate(
            { _id: req.body.id },
            { $push: { friends: req.body.name } }
        ).then((r) => {
            return res.status(200);
        })

    } catch (err) {
        return res.json({ message: err.message });
    }
});

// Get Friends List
router.get('/friends/', async (req, res) => {
    try {
        await accountSchema.find(
            { _id: req.query.id },
            { friends: 1 }
        ).then((r) => {
            accountSchema.find(
                { userName: { $in: r[0].friends } },
                { _id: 1, userName: 1 }
            ).then((r2) => {
                return res.json(r2);
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