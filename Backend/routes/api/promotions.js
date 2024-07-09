const express = require('express');
const router = express.Router();
const promotionController = require('../../controllers/promotionController');

router.post('/add', promotionController.addPromotion);

module.exports = router;
