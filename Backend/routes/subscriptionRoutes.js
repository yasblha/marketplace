// backend/routes/subscriptionRoutes.js
const express = require('express');
const User = require('../models/User');
const { sendAlertEmail } = require('../utils/email');
const { sendPushNotification } = require('../utils/push');
const router = express.Router();

const validAlertTypes = ['newProduct', 'priceChange', 'promotion'];

router.post('/subscribe', async (req, res) => {
    const { email, alertType, userToken } = req.body;

    if (!email || !alertType) {
        return res.status(400).json({ message: 'Email and alert type are required.' });
    }
    if (!validAlertTypes.includes(alertType)) {
        return res.status(400).json({ message: 'Invalid alert type provided.' });
    }

    try {
        const user = await User.findOneAndUpdate(
            { email: email },
            { $set: { [`alerts.${alertType}`]: true } },
            { new: true, upsert: true }
        );

        if (user) {
            sendAlertEmail(email, alertType);
            sendPushNotification(userToken, `Subscribed to ${alertType}`);
        }

        res.status(200).json({ message: `Subscribed to ${alertType} successfully.`, user: user });
    } catch (error) {
        res.status(500).json({ message: 'Error subscribing to alerts.' });
    }
});

router.post('/unsubscribe', async (req, res) => {
    const { email, alertType, userToken } = req.body;

    if (!email || !alertType) {
        return res.status(400).send({ message: 'Email and alert type are required.' });
    }
    if (!validAlertTypes.includes(alertType)) {
        return res.status(400).send({ message: 'Invalid alert type provided.' });
    }

    try {
        const user = await User.findOneAndUpdate(
            { email: email },
            { $set: { [`alerts.${alertType}`]: false } },
            { new: true }
        );

        if (user) {
            sendAlertEmail(email, `Unsubscribed from ${alertType}`);
            sendPushNotification(userToken, `Unsubscribed from ${alertType}`);
        }

        res.status(200).send({ message: `Unsubscribed from ${alertType} successfully.`, user: user });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
