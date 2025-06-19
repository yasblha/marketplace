import express from 'express';
const router = express.Router();
import * as AnalyticsController from '../../controllers/AnalyticsController.js';

router.get('/overview', AnalyticsController.getOverview);

export default router;
