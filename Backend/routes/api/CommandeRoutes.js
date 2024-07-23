const express = require('express');
const router = express.Router();
const OrderController = require('../../controllers/CommandeController');

router.post('/orders', OrderController.createOrder);
router.get('/orders/:orderId', OrderController.getOrderById);
router.put('/orders/:orderId', OrderController.updateOrder);
router.delete('/orders/:orderId', OrderController.deleteOrder);
router.post('/orders/:orderId/products/:productId', OrderController.addProductToOrder);
router.delete('/orders/:orderId/products/:productId', OrderController.removeProductFromOrder);
router.get('/orders/:orderId/products', OrderController.getProductsFromOrder);

module.exports = router;
