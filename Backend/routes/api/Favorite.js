const express = require('express');
const router = express.Router();
const tokenJWT = require('../middleware/tokenJWT');
const { getFavorites } = require('../controllers/favoriteController');

router.get('/favorites', tokenJWT, getFavorites);

module.exports = router;
