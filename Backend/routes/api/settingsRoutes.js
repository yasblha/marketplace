import express from 'express';
import * as SettingsController from '../../controllers/SettingsController.js';
import { authenticateAdmin } from '../../middleware/authAdmin.js';

const router = express.Router();

router.get('/', authenticateAdmin, SettingsController.getSettings);
router.put('/', authenticateAdmin, SettingsController.updateSettings);

export default router; 