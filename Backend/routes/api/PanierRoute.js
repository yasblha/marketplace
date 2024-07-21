const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/PanierController');
const {authenticateToken} = require("../../middleware/authAdmin");


router.post('/cart',authenticateToken, cartController.createCartItem);
router.get('/cart/:userid',authenticateToken, cartController.getCartItems);
router.put('/cart/:id', authenticateToken,cartController.updateCartItem);
router.delete('/cart/:id',authenticateToken, cartController.deleteCartItem);

module.exports = router;