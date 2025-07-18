import express from 'express';
import TestAlertController from '../../controllers/TestAlertController.js';
import authenticateToken from '../../middleware/tockenJWT.js';
import isAdmin from '../../middleware/isAdmin.js';

const router = express.Router();

// Toutes les routes de test nécessitent une authentification et des droits admin
router.use(authenticateToken);
router.use(isAdmin);

// Routes pour tester les alertes
router.post('/alert/price-change', TestAlertController.simulatePriceChange);
router.post('/alert/restock', TestAlertController.simulateRestock);
router.post('/password-renewal', TestAlertController.testPasswordRenewalEmail);

export default router;
