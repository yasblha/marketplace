const express = require('express');
const { sendPromotions } = require('../../controllers/newsletterController');
const router = express.Router();

router.post('/send-promotions', sendPromotions);

module.exports = router;
