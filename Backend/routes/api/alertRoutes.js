import express from 'express';
import authenticateToken from '../../middleware/tockenJWT.js';
import AlertController from '../../controllers/AlertController.js';

const router = express.Router();

// Routes protégées par authentification
router.use(authenticateToken);

// Routes CRUD basiques
router.post('/', AlertController.createAlert);
router.get('/', AlertController.getUserAlerts);
router.put('/:id', AlertController.updateAlert);
router.delete('/:id', AlertController.deleteAlert);
router.patch('/:id/toggle', AlertController.toggleAlert);

// Routes spécifiques pour les types d'alertes
router.post('/newsletter/subscribe', AlertController.subscribeNewsletter);
router.post('/newsletter/unsubscribe', AlertController.unsubscribeNewsletter);
router.post('/restock', AlertController.createRestockAlert);
router.post('/price-change', AlertController.createPriceChangeAlert);
router.post('/new-products', AlertController.createNewProductAlert);

export default router;
