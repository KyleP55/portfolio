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
    console.log('asdasdasd')
    try {
        const id = req.userData.id;

        await accountSchema.findOne({ _id: id }, { rooms: 1, friends: 1 })
            .then((res) => {
                console.log(res)
                res.json(res);
            });
    } catch (err) {
        res.json(err);
    }
});

//Generate Token
function generateToken(sig) {
    return jwt.sign(sig, jwtSecret, { expiresIn: '60s' });
}

module.exports = router;