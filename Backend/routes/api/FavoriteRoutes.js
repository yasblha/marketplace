import express from 'express';
const router = express.Router();
import tokenJWT from '../../middleware/tockenJWT.js';
//import { getFavorites } from '../../controllers/FavoritesController.js';
import * as FavoriteController from '../../controllers/FavoritesController.js';

// Route pour récupérer les favoris de l'utilisateur courant authentifié
router.get('/', tokenJWT, FavoriteController.getCurrentUserFavorites);

// Route pour récupérer les favoris d'un utilisateur spécifique par son ID
router.get('/:id', tokenJWT, FavoriteController.getFavorites);

export default router;
