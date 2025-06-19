import express from 'express';
const router = express.Router();
import tokenJWT from '../../middleware/tockenJWT.js';
//import { getFavorites } from '../../controllers/FavoritesController.js';
import * as FavoriteController from '../../controllers/FavoritesController.js';

router.get('/favorites/:id', tokenJWT, FavoriteController.getFavorites);

export default router;
