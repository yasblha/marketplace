import express from 'express';
import * as DeliveryAddressController from '../../controllers/AdresseController.js';
import { authenticateToken } from '../../middleware/authAdmin.js';

const router = express.Router();

router.use((req, _res, next) => {
  console.log('[Adresse]', req.method, req.originalUrl);
  next();
});

router.post('/', authenticateToken, DeliveryAddressController.createAddress);
router.get('/users/:userId/addresses', authenticateToken, DeliveryAddressController.getAddressesByUserId);

router.get('/:addressId', authenticateToken, DeliveryAddressController.getAddressById);
router.put('/:addressId', authenticateToken, DeliveryAddressController.updateAddress);
router.delete('/:addressId', authenticateToken, DeliveryAddressController.deleteAddress);

export default router;
