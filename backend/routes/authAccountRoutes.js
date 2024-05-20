const express = require('express');
const router = express.Router();
const accountSchema = require('../models/AccountSchema.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get Context Info
router.get('/context', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const id = decodedToken.id;

        const account = await accountSchema.findOne({ _id: id }, { email: 1, userName: 1, _id: 1 });

        console.log(account)

        if (account == undefined) return res.json({ message: "User not found" });

        return res.json(account);
    } catch (err) {
        console.log(err)
        return res.json(err);
    }
});

// Get Context Info
router.post('/test', async (req, res) => {

    return res.json({ message: 'Hit End Point' });
});

//Generate Token
function generateToken(sig) {
    return jwt.sign(sig, process.env.JWT_SECRET, { expiresIn: '60s' });
}

module.exports = router;