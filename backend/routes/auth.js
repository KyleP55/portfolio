const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const path = require('path');

// Create Account
router.post('/createAccount', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(req.body.password);


    }
});