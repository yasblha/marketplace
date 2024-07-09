const express = require('express');
const alertController = require('../../controllers/alertController');
const router = express.Router();

router.post('/subscribe', alertController.subscribe);
router.post('/unsubscribe', alertController.unsubscribe);

module.exports = router;
