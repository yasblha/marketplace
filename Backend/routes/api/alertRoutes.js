const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middleware/authAdmin');
const AlertController = require('../../controllers/AlertController');

router.post('/', authenticateToken, AlertController.createAlert);
router.get('/', authenticateToken, AlertController.getAlerts);
router.delete('/:id', authenticateToken, AlertController.deleteAlert);
router.post('/stock', authenticateToken, AlertController.createStockAlert);

module.exports = router;
