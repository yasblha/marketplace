const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Valider que les types d'alertes sont ceux attendus
const validAlertTypes = ['newProduct', 'priceChange', 'promotion']; // Exemple de types d'alerte

router.post('/subscribe', async (req, res) => {
    const { email, alertType } = req.body;
    console.log('Attempting to subscribe:', email, alertType);


    // Validation des entrées
    if (!email || !alertType) {
        return res.status(400).send({ message: 'Email and alert type are required.' });
    }
    if (!validAlertTypes.includes(alertType)) {
        return res.status(400).send({ message: 'Invalid alert type provided.' });
    }

    try {
        const user = await User.findOneAndUpdate(
            { email: email },
            { $set: { [`alerts.${alertType}`]: true } },
            { new: true, upsert: true }
        );
        console.log('Subscription successful:', user);
        res.status(200).send({ message: `Subscribed to ${alertType} successfully.`, user: user });
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).send({ error: error.message });
    }
});

router.post('/unsubscribe', async (req, res) => {
    const { email, alertType } = req.body;

    // Validation des entrées
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
        res.status(200).send({ message: `Unsubscribed from ${alertType} successfully.`, user: user });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
