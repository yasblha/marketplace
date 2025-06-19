import express from 'express';
const router = express.Router();
import authControllers from '../../controllers/AuthController.js';
import { authenticateToken, authenticateAdmin, authenticateCompta } from '../../middleware/authAdmin.js';

// Routes publiques d'authentification
router.post('/register', authControllers.register);
router.post('/login', authControllers.login);
//router.post('/refresh-token', authControllers.refresh);
router.post('/refresh-token', authControllers.refreshToken);
router.post('/forgot-password', authControllers.requestPasswordReset);
router.patch('/reset-password', authControllers.resetPassword);
router.get('/confirm-email/:token', authControllers.confirmEmail);

// Routes protégées (nécessitant une authentification)
//router.use(authenticateToken);

router.post('/logout', authenticateToken, authControllers.logout);
router.get('/me',authenticateToken, authControllers.user);
router.get('/users',authenticateToken, authControllers.users);

router.patch('/user/:id', authenticateToken, authControllers.updateUser);
router.post('/impersonate/:id', authenticateCompta, authControllers.impersonateUser);

export default router;
