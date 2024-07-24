const express = require('express');
const router = express.Router();
const AlertController = require('../../controllers/AlertController');

// Routes for managing alerts
router.post('/alerts', AlertController.createAlert);
router.delete('/alerts/:id', AlertController.deleteAlert);

// Routes for managing alert subscriptions
router.post('/alerts/subscribe', AlertController.subscribeToAlert);
router.post('/alerts/unsubscribe', AlertController.unsubscribeFromAlert);

module.exports = router;
