const express = require('express');
const router = express.Router();
const AnalyticsController = require('../../controllers/AnalyticsController');

router.get('/overview', AnalyticsController.getOverview);

module.exports = router;
