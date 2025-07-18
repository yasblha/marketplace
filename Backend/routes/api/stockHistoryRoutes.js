import express from 'express';
import { authenticateToken } from '../../middleware/authAdmin.js';
import isAdmin from '../../middleware/isAdmin.js';
import StockHistoryController from '../../controllers/StockHistoryController.js';

const router = express.Router();

/**
 * @route   GET /api/stock-history/evolution
 * @desc    Récupérer l'évolution du stock pour un ou plusieurs produits
 * @access  Admin
 */
router.get('/evolution', authenticateToken, isAdmin, StockHistoryController.getStockEvolution.bind(StockHistoryController));

/**
 * @route   GET /api/stock-history/low-stock
 * @desc    Récupérer les alertes de stock bas
 * @access  Admin
 */
router.get('/low-stock', authenticateToken, isAdmin, StockHistoryController.getLowStockAlerts.bind(StockHistoryController));

/**
 * @route   GET /api/stock-history/export-csv
 * @desc    Exporter les produits en stock bas au format CSV
 * @access  Admin
 */
router.get('/export-csv', authenticateToken, isAdmin, StockHistoryController.exportLowStockCsv.bind(StockHistoryController));

export default router;
