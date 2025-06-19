import express from 'express';
const router = express.Router();
import * as paymentController from '../../controllers/PaymentController.js';

// Payment routes
router.post('/', paymentController.createPayment);
router.get('/:id', paymentController.getPayment);
router.put('/:id/status', paymentController.updatePaymentStatus);
router.get('/users/:userId/payments', paymentController.listPaymentsByUser);

export default router;

