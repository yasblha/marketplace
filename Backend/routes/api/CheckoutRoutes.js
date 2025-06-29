import express from 'express';
import authenticateToken from '../../middleware/tockenJWT.js';
import {
  validateCart,
  createOrder,
  processPayment,
  getOrderSummary,
  cancelOrder,
  extendReservations,
  releaseReservation,
  getReservationStatus
} from '../../controllers/CheckoutController.js';

const router = express.Router();

// Routes publiques (sans authentification obligatoire)
router.get('/cart/:userId/validate', validateCart);
router.get('/cart/:userId/status', getReservationStatus);
router.post('/cart/:userId/extend', extendReservations);
router.post('/cart/:cartItemId/release', releaseReservation);

// Routes protégées par authentification
router.use(authenticateToken);

// Workflow de checkout
router.post('/cart/:userId/order', createOrder);
router.post('/order/:orderId/payment', processPayment);
router.get('/order/:orderId/summary', getOrderSummary);
router.post('/order/:orderId/cancel', cancelOrder);

export default router; 