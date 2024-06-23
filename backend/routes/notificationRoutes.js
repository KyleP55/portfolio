const express = require('express');
const router = express.Router();
const notificationSchema = require('../models/NotificationSchema.js');
const accountSchema = require('../models/AccountSchema.js');

router.post('/', async (req, res) => {
    let x = req.body;
    let targetID = null;
    try {
        targetID = await accountSchema.findOne({ userName: x.target }, { _id: 1 });
        if (targetID) {
            console.log(targetID);
        } else {
            throw 'Account not found'
        }
    } catch (err) {
        return res.json({ message: err });
    }

    let newNotification = new notificationSchema({
        account: targetID._id,
        type: x.type,
        message: x.message,
        date: new Date().toDateString()
    })
    console.log('asdnhoasnd')
    return res.status(200).json({ message: 'yee' });
    try {
        // await newNotification.save()
        //     .then((r) => {
        //         console.log('notification created')
        //         return res.status(200);
        //     });

        return res.status(200);
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
            return res.json(r);
        });
    } catch (err) {
        return res.json({ message: err.message });
    }
});

module.exports = router;