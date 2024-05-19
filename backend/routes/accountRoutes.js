const express = require('express');
const router = express.Router();
const accountSchema = require('../models/AccountSchema.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Create Account
router.post('/createAccount', async (req, res) => {
    try {
        const b = req.body;

        // Check if email exists
        const check = await accountSchema.find({ email: b.email });
        if (check[0]) return res.json({ message: "Email already linked to account." });

        // Create Account and Log in
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(b.password, salt);

        const account = new accountSchema({
            email: b.email,
            password: hashedPass,
            userName: b.userName,
        });

        const newAccount = await account.save();
        console.log('created account');

        const sig = { id: newAccount._id, email: newAccount.email, userName: newAccount.userName };
        const accessToken = generateToken(sig);

        console.log('signed token');

        res.status(201).json({ token: accessToken });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Log In
router.post('/login', async (req, res) => {
    const b = req.body;
    const account = await accountSchema.findOne({ email: b.email }, { email: 1, password: 1, userName: 1, _id: 1 });

    if (account == undefined) return res.json({ message: "User not found" });

    //Check password
    try {
        if (bcrypt.compare(b.password, account.password)) {
            //Create JWT
            let sig = { id: account._id, email: account.email, userName: account.userName };
            const accessToken = generateToken(sig);

            sig = { id: account._id, email: account.email, userName: account.userName, token: accessToken };

            return res.status(200).json(sig);
        }
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
});

// Check if Email exists
router.post('/checkEmail', async (req, res) => {
    const b = req.body;
    const check = await accountSchema.findOne({ email: b.email }, { email: true });

    if (check) return res.status(200).json({ emailTaken: true });
    return res.status(200).json({ emailTaken: false });
});

// Check if user name exists
router.post('/checkUserName', async (req, res) => {
    const b = req.body;
    const check = await accountSchema.findOne({ userName: b.userName }, { userName: true });

    if (check) return res.status(200).json({ nameTaken: true });
    return res.status(200).json({ nameTaken: false });
});

//Generate Token
function generateToken(sig) {
    return jwt.sign(sig, process.env.JWT_SECRET, { expiresIn: '60s' });
}

module.exports = router;