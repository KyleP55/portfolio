const express = require('express');
const router = express.Router();
const notificationSchema = require('../models/NotificationSchema.js');

router.post('/', async (req, res) => {
    let x = req.body;
    let newNotification = {
        account: x.account,
        type: x.type,
        message: x.message,
        date: x.date
    }

    try {
        await newNotification.save()
            .then(() => {
                return res.status(200);
            });
    } catch (err) {
        return res.json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    let accountID = req.params.id;

    try {
        await notificationSchema.find(
            { account: accountID }
        ).then((r) => {
            console.log(r)
            return res.json(r);
        });
    } catch (err) {
        return res.json({ message: err.message });
    }
});

module.exports = router;