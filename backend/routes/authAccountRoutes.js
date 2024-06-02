const express = require('express');
const router = express.Router();
const accountSchema = require('../models/AccountSchema.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get Context Info
router.get('/context', async (req, res) => {
    try {
        const id = tokenID(req.headers.authorization);

        const account = await accountSchema.findOne({ _id: id }, { email: 1, userName: 1, _id: 1 });

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
        const id = tokenID(req.headers.authorization);

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
    return jwt.sign(sig, process.env.JWT_SECRET, { expiresIn: '60s' });
}

// Get Account id with token
function tokenID(auth) {
    const token = auth.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken.id;
}

module.exports = router;