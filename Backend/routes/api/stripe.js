const express = require('express');
const router = express.Router();
const StripeController = require('../../controllers/StripeController');

router.post('/create-checkout-session', StripeController.createCheckoutSession);
router.post('/create-payment-intent', StripeController.createPaymentIntent);

module.exports = router;


