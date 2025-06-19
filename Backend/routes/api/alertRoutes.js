import express from 'express';
const router = express.Router();
import { authenticateToken } from '../../middleware/authAdmin.js';
import AlertController from '../../controllers/AlertController.js';

router.post('/', authenticateToken, AlertController.createAlert);
router.get('/', authenticateToken, AlertController.getAlerts);
router.delete('/:id', authenticateToken, AlertController.deleteAlert);
router.post('/stock', authenticateToken, AlertController.createStockAlert);

export default router;
