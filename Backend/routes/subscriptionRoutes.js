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
        let user = await User.findOne({ email: email });
        if (!user) {
            // Crée un nouvel utilisateur avec un `username` par défaut
            user = new User({
                firstName: 'Ibrahim', // Remplacez par des valeurs appropriées
                lastName: 'Ouahabi',   // Remplacez par des valeurs appropriées
                email: email,
                username: email.split('@')[0], // Utilise la partie avant '@' de l'email comme `username`
                password: 'ESGI2024.',   // Assurez-vous de définir ou de générer un mot de passe valide
                alerts: {
                    newProduct: false,
                    priceChange: false,
                    promotion: false
                }
            });
        }

        // Met à jour l'alerte pour l'utilisateur
        user.alerts[alertType] = true;
        await user.save();

        sendAlertEmail(email, alertType);
        sendPushNotification(userToken, `Subscribed to ${alertType}`);

        res.status(200).json({ message: `Subscribed to ${alertType} successfully.`, user: user });
    } catch (error) {
        console.error(error);
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
