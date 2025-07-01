import express from 'express';
import { getStockHistory, addStockEntry } from '../../controllers/StockController.js';
const router = express.Router();

router.get('/:productId/history', getStockHistory);
router.post('/:productId/history', addStockEntry);

export default router; 