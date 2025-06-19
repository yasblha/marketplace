import express from 'express';
const router = express.Router();
import returnController from '../../controllers/ReturnsController.js';

router.post('/', returnController.createReturn);
router.get('/:id', returnController.getReturn);
router.put('/:id/status', returnController.updateReturnStatus);
router.get('/users/:userId/returns', returnController.listReturnsByUser);

export default router;
