const express = require('express');
const router = express.Router();
const AlertController = require('../../controllers/AlertController');

// Routes for managing alert subscriptions
router.post('/subscribe/:userId/:productId', AlertController.subscribeToAlert);
router.post('/unsubscribe/:userId/:productId', AlertController.unsubscribeFromAlert);

// Routes for managing newsletter subscriptions
router.post('/newsletters/subscribe/:email', AlertController.subscribeToNewsletter);
router.post('/newsletters/unsubscribe/:email', AlertController.unsubscribeFromNewsletter);


module.exports = router;