const express = require('express');
const router = express.Router();
const accountSchema = require('../models/AccountSchema.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get Context Info
router.get('/context', async (req, res) => {
    const b = req.body;
    const account = await accountSchema.findOne({ email: b.email }, { email: 1, userName: 1, _id: 1 });

    if (account == undefined) return res.json({ message: "User not found" });

    return res.json(account);
});


//Generate Token
function generateToken(sig) {
    return jwt.sign(sig, process.env.JWT_SECRET, { expiresIn: '60s' });
}

module.exports = router;