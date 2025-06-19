import express from 'express';
const router = express.Router();
import * as cartController from '../../controllers/PanierController.js';
import { authenticateToken } from '../../middleware/authAdmin.js';


router.post('/', cartController.createCartItem);
router.get('/:userid', cartController.getCartItems);
router.put('/:id', authenticateToken,cartController.updateCartItem);
router.delete('/:id',authenticateToken, cartController.deleteCartItem);

export default router;
