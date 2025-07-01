import 'dotenv/config'
import Stripe from 'stripe'

const stripe      = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
const FRONT_BASE  = process.env.FRONT_URL || 'http://localhost:5173'

const buildLineItems = items =>
    items.map(i => ({
      price_data: {
        currency: 'usd',
        product_data: { name: i.name || 'Item' },
        unit_amount: Math.round(i.price * 100),
      },
      quantity: i.quantity || 1,
    }))

export async function createCheckoutSession (req, res) {
  const { items, customer } = req.body
  if (!Array.isArray(items) || !customer?.email) {
    return res.status(400).json({ error: 'invalid payload' })
  }
  if (!items.length) {
    return res.status(400).json({ error: 'items array must contain at least one product' })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'],
      line_items: buildLineItems(items),
      customer_email: customer.email,
      mode: 'payment',
      success_url: `${FRONT_BASE}/paymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url : `${FRONT_BASE}/paymentCancel`,
    })
    res.json({ sessionId: session.id, url: session.url })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function createCheckoutSessionPaypal (req, res) {
  const { items, customer } = req.body
  if (!Array.isArray(items) || !customer?.email) {
    return res.status(400).json({ error: 'invalid payload' })
  }
  if (!items.length) {
    return res.status(400).json({ error: 'items array must contain at least one product' })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['paypal'],
      line_items: buildLineItems(items),
      customer_email: customer.email,
      mode: 'payment',
      success_url: `${FRONT_BASE}/paymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url : `${FRONT_BASE}/paymentCancel`,
    })
    res.json({ sessionId: session.id, url: session.url })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function createPaymentIntent (req, res) {
  const { amount, customer } = req.body
  if (!amount || !customer?.email) {
    return res.status(400).json({ error: 'invalid payload' })
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: 'usd',
      payment_method_types: ['card'],
      receipt_email: customer.email,
      metadata: {
        frontend_success: `${FRONT_BASE}/paymentSuccess`,
        frontend_cancel : `${FRONT_BASE}/paymentCancel`,
      },
    })
    res.json({ clientSecret: intent.client_secret })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
