const express = require('express');
const router = express.Router();
const DeliveryAddressController = require('../../controllers/AdresseController');

router.post('/', DeliveryAddressController.createAddress);
router.get('/:addressId', DeliveryAddressController.getAddressById);
router.put('/:addressId', DeliveryAddressController.updateAddress);
router.delete('/:addressId', DeliveryAddressController.deleteAddress);
router.get('/users/:userId/addresses', DeliveryAddressController.getAddressesByUserId);

module.exports = router;
