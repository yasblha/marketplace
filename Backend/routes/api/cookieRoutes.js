const express = require('express');
const router = express.Router();

// Variable pour stocker l'état de consentement aux cookies
let hasAcceptedCookies = false;

// Route pour obtenir l'état actuel des cookies
router.get('/check-cookies', (req, res) => {
    res.json({ hasAcceptedCookies });
});

// Route pour accepter les cookies
router.post('/accept-cookies', (req, res) => {
    hasAcceptedCookies = true;
    res.status(200).send('Cookies accepted');
});

// Route pour refuser les cookies
router.post('/reject-cookies', (req, res) => {
    hasAcceptedCookies = false;
    res.status(200).send('Cookies rejected');
});

module.exports = router;
