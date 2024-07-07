const express = require('express');
const router = express.Router();
const authControllers = require('../../controllers/AuthController');
//const db = require('../../config/postgres_models');
const { authenticateToken } = require('../../middleware/authAdmin');


router.post('/register', authControllers.register);
router.get('/confirm/:token', authControllers.confirmEmail);
router.post('/request-password-reset', authControllers.requestPasswordReset);
router.post('/reset-password', authControllers.resetPassword);

router.post('/login', authControllers.login);
router.post('/logout', authenticateToken, authControllers.logout);
router.post('/refresh', authControllers.refresh);
router.get('/users', authenticateToken, authControllers.user);
router.get('/user', authenticateToken, authControllers.getUser);
//router.get('/user', authControllers.);

module.exports = router;
