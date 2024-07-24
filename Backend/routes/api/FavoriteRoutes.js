const express = require('express');
const router = express.Router();
const { addProductToFavorites, getFavoritesByUserId, removeFavorite } = require('../../controllers/FavoritesController');

router.post('/add', addProductToFavorites);
router.get('/:userId', getFavoritesByUserId);
router.post('/remove', removeFavorite);

module.exports = router;