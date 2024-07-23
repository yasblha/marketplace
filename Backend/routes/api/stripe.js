const express = require('express');
const router = express.Router();
const StripeController = require('../../controllers/StripeController');

router.post('/create-checkout-session', StripeController.createCheckoutSession);

module.exports = router;
