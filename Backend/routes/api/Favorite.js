const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/FavoriteController');

router.post('/favorites', favoriteController.createFavorite);
router.get('/favorites/:userid', favoriteController.getFavorites);
router.delete('/favorites/:id', favoriteController.deleteFavorite);

module.exports = router;
