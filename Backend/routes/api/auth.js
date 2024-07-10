const express = require('express');
const router = express.Router();
const authControllers = require('../../controllers/AuthController');
const { authenticateToken } = require('../../middleware/authAdmin');

// Routes publiques d'authentification
router.post('/register', authControllers.register);
router.post('/login', authControllers.login);
router.post('/refresh-token', authControllers.refresh);
router.post('/forgot-password', authControllers.requestPasswordReset);
router.patch('/reset-password', authControllers.resetPassword);
router.get('/confirm-email/:token', authControllers.confirmEmail);

// Routes protégées (nécessitant une authentification)
router.use(authenticateToken); // Applique l'authentification à toutes les routes suivantes

router.post('/logout', authControllers.logout);
router.get('/me', authControllers.getUser);
router.get('/users', authControllers.user);
module.exports = router;