const express = require('express');
const router = express.Router();
const productControllers = require('../../controllers/ProductController');
const authenticateAdmin = require('../../middleware/authAdmin').authenticateAdmin;
const upload = require('../../middleware/upload');

// Routes publiques
router.get('/get', productControllers.getAllProducts);
router.get('/search', productControllers.searchProducts);
//router.get('/category/:category', productControllers.getProductsByCategory);
router.get('/:id', productControllers.getProductById);

// Routes protégées (authentification admin requise)
//router.post('/', authenticateAdmin, upload.array('images', 5), productControllers.createProduct);
router.post('/', upload.array('images', 5), productControllers.createProduct);
router.put('/:id', authenticateAdmin, upload.array('images', 5), productControllers.updateProduct);
//router.delete('/:id', authenticateAdmin, productControllers.deleteProduct);
router.delete('/:id', productControllers.deleteProduct);
router.patch('/:id/stock', authenticateAdmin, productControllers.updateProductStock);

module.exports = router;