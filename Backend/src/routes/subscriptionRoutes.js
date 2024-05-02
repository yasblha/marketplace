const express = require('express');
const User = require('../models/User');
const sendEmail = require('../services/mailer');
const router = express.Router();

router.post('/subscribe', async (req, res) => {
    const { email, alertType } = req.body;
    try {
        const user = await User.findOneAndUpdate({ email: email }, { $set: { [`alerts.${alertType}`]: true } }, { new: true, upsert: true });
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/unsubscribe', async (req, res) => {
    const { email, alertType } = req.body;
    try {
        const user = await User.findOneAndUpdate({ email: email }, { $set: { [`alerts.${alertType}`]: false } }, { new: true });
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
