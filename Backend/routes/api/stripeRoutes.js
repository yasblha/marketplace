import express from 'express';
const router = express.Router();
import * as StripeController from '../../controllers/StripeController.js';

router.post('/create-checkout-session', StripeController.createCheckoutSession);
router.post('/create-payment-intent', StripeController.createPaymentIntent);
router.post('/create-checkout-session-paypal', StripeController.createCheckoutSessionPaypal);

export default router;

