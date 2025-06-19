import express from 'express';
const router = express.Router();
import * as OrderController from '../../controllers/CommandeController.js';

router.post('/', OrderController.createOrder);
router.get('/', OrderController.getOrders);
router.get('/user/:userId', OrderController.getOrdersByUserId);
router.get('/:orderId', OrderController.getOrderById);
router.put('/:orderId', OrderController.updateOrder);
router.delete('/:orderId', OrderController.deleteOrder);
router.post('/:orderId/products/:productId', OrderController.addProductToOrder);
router.delete('/:orderId/products/:productId', OrderController.removeProductFromOrder);
router.get('/:orderId/products', OrderController.getProductsFromOrder);

export default router;
