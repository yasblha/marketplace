import express from 'express';
const router = express.Router();
import { authenticateAdmin } from '../../middleware/authAdmin.js';
import upload from '../../middleware/upload.js';
import * as productControllers from '../../controllers/productController.js';

// Route protégée (authentification admin requise) pour l'upload des images
router.post('/upload', authenticateAdmin, productControllers.uploadProductImages);

export default router;
