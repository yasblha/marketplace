import express from 'express';
const router = express.Router();
import invoiceController from '../../controllers/InvoiceController.js';
import { authenticateToken } from '../../middleware/authAdmin.js';
import isAdmin from '../../middleware/isAdmin.js';

// Routes pour les utilisateurs standard
router.get('/user', authenticateToken, invoiceController.getUserInvoices);
router.get('/order/:orderId', authenticateToken, invoiceController.generateInvoice);
router.post('/order/:orderId/send-email', authenticateToken, invoiceController.sendInvoiceByEmail);
router.get('/order/:orderId/preview', authenticateToken, invoiceController.previewInvoice);
router.get('/order/:orderId/download', authenticateToken, invoiceController.downloadInvoice);

// Routes pour les administrateurs
router.get('/admin/all', authenticateToken, isAdmin, invoiceController.getAllInvoices);
router.post('/admin/generate-missing', authenticateToken, isAdmin, invoiceController.generateMissingInvoices);

export default router;
