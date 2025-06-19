import express from 'express';
const router = express.Router();
import * as SectionController from '../../controllers/MenuController.js';

router.get('/', SectionController.getSections);
router.post('/', SectionController.createSection);
router.put('/:id', SectionController.updateSection);
router.delete('/:id', SectionController.deleteSection);

export default router;
