const express = require('express');
const router = express.Router();
const productControllers = require('../../controllers/ProductController');
const authenticateAdmin = require('../../middleware/authAdmin').authenticateAdmin;
const upload = require('../../middleware/upload');

// Routes spécifiques
router.get('/all', productControllers.getAllProducts);
router.get('/search', productControllers.searchProducts);
router.get('/category/:category', productControllers.getProductsByCategory);

// Route de création (protégée)
router.post('/create', upload.single('image'), productControllers.createProduct);

// Routes avec ID
router.get('/:id', productControllers.getProductById);
router.put('/:id', authenticateAdmin, upload.single('image'), productControllers.updateProduct);
router.delete('/:id', authenticateAdmin, productControllers.deleteProduct);
router.put('/:id/stock', authenticateAdmin, productControllers.updateProductStock);

module.exports = router;