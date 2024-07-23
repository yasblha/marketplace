require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Récupère la clé secrète Stripe depuis .env

exports.createCheckoutSession = async (req, res) => {
  const { items, customer } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          unit_amount: item.price ? item.price * 100 : 10 * 100, // Montant de test en cents ou celui envoyé
        },
        quantity: item.quantity || 2, // Quantité de test ou celle envoyée
      })),
      customer_email: customer.email || "test@example.com", // Email de test ou celui envoyé
      mode: 'payment',
      success_url: 'http://localhost:8080/success',
      cancel_url: 'http://localhost:8080/cancel',
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
