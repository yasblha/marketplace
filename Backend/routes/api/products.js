import express from 'express';
const router = express.Router();
import * as productControllers from '../../controllers/productController.js';
import { authenticateAdmin, authenticateToken } from '../../middleware/authAdmin.js';
import upload from '../../middleware/upload.js';

// Routes publiques
router.get('/', productControllers.getAllProducts);
router.get('/search', productControllers.searchProducts);
router.get('/categories', productControllers.getProductCategories);
router.get('/:id', productControllers.getProductById);

// Routes protégées (authentification admin requise)
router.post('/', authenticateAdmin,productControllers.createProduct);
//router.post('/upload', authenticateAdmin, upload, productControllers.uploadProductImages);
router.put('/:id', authenticateAdmin, productControllers.updateProduct);
router.delete('/:id', authenticateAdmin, productControllers.deleteProduct);
router.patch('/:id/stock', authenticateAdmin, productControllers.updateProductStock);

router.post('/inject-products', productControllers.injectProducts);


export default router;
