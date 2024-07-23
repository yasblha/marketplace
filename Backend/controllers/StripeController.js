require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Récupère la clé secrète Stripe depuis .env

exports.createCheckoutSession = async (req, res) => {
  const { items, customer } = req.body;

  console.log('Received items:', items);
  console.log('Received customer:', customer);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name || "Test Product" // Nom du produit
          },
          unit_amount: item.price * 100, // Montant en cents
        },
        quantity: item.quantity || 1, // Quantité envoyée ou par défaut à 1
      })),
      customer_email: customer.email || "test@example.com", // Email envoyé ou par défaut
      mode: 'payment',
      success_url: 'http://localhost:5173/paymentSuccess',
      cancel_url: 'http://localhost:5173//paymentCancel',
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
