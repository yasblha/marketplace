const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const Alert = require('../models/Alert');

router.post('/subscribe', authenticateToken, async (req, res) => {
    const { alertType } = req.body;
    const userId = req.user.id;
    try {
        const alert = new Alert({ userId, alertType });
        await alert.save();
        res.status(201).json({ message: 'Subscription successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error subscribing to alert' });
    }
});

router.delete('/unsubscribe', authenticateToken, async (req, res) => {
    const { alertType } = req.body;
    const userId = req.user.id;
    try {
        await Alert.deleteOne({ userId, alertType });
        res.status(200).json({ message: 'Unsubscribed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error unsubscribing' });
    }
});

module.exports = router;
