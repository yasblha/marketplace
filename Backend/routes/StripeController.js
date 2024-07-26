const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SK);

router.post('/create-payment-intent', async (req, res) => {
    const { paymentMethodId, amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'eur',
            payment_method: paymentMethodId,
            confirmation_method: 'manual',
            confirm: true,
            return_url: 'http://localhost:3000/payment-complete',
        });

        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;
