const express = require('express');
const router = express.Router();
const notificationSchema = require('../models/NotificationSchema.js');
const accountSchema = require('../models/AccountSchema.js');
const roomSchema = require('../models/RoomSchema.js');

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
        from: x.from,
        date: new Date().toDateString()
    });

    try {
        await newNotification.save()
            .then((r) => {
                console.log('notification created')
                return res.json({ message: 'Completed' });
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
            return res.json(r);
        });
    } catch (err) {
        return res.json({ message: err.message });
    }
});

router.post('/acceptfriend/:id', async (req, res) => {
    try {
        await notificationSchema.findById(
            req.params.id
        ).then((r) => {
            let newRoom = new roomSchema({
                name: r.account + "_" + r.from,
                public: false,
                group: false
            });

            const x = newRoom.save();

            accountSchema.findByIdAndUpdate(
                r.from,
                { $push: { friends: r.account, rooms: x._id } }
            ).then(() => { });

            accountSchema.findByIdAndUpdate(
                r.account,
                { $push: { friends: r.from, rooms: x._id } }
            ).then(() => { });



        });

        await notificationSchema.findByIdAndDelete(req.params.id);
        return res.json({ message: 'Friend Added' });
    } catch (err) {
        return res.json({ message: err.message });
    }
});

module.exports = router;