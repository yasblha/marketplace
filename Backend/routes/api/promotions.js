const express = require('express');
const router = express.Router();
const promotionController = require('../../controllers/promotionController');

router.post('/add', (req, res) => {
    promotionController.addPromotion(req.body)
        .then(() => res.status(200).send({ message: 'Promotion added and subscribers notified.' }))
        .catch(error => res.status(500).send({ error: error.message }));
});

module.exports = router;
