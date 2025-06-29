import express from 'express';
const router = express.Router();
import * as DeliveryAddressController from '../../controllers/AdresseController.js';
import { authenticateToken, authenticateAdmin } from '../../middleware/authAdmin.js';

router.post('/', DeliveryAddressController.createAddress);
router.get('/:addressId',authenticateToken, DeliveryAddressController.getAddressById);
router.put('/:addressId', authenticateToken,DeliveryAddressController.updateAddress);
router.delete('/:addressId', authenticateToken,DeliveryAddressController.deleteAddress);
router.get('/users/:userId/addresses', DeliveryAddressController.getAddressesByUserId);

export default router;
