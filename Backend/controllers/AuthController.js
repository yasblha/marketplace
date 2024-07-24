const User = require('../models/postgres_models/UserPg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendEmail } = require('../services/mailer');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

function generateToken(user) {
    if (!user.role) {
        throw new Error('User role is not defined');
    }
    return jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '60m' });
}

function generateRefreshToken(user) {
    return jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

let loginAttempts = {};

async function handleFailedLoginAttempt(email, res) {
    if (loginAttempts[email] && loginAttempts[email] >= 3) {
        await sendAccountBlockedEmail(email);
        return res.status(429).json({ message: 'Votre compte est temporairement bloqué. Réessayez plus tard.' });
    }

    loginAttempts[email] = (loginAttempts[email] || 0) + 1;

    if (loginAttempts[email] >= 3) {
        setTimeout(() => {
            delete loginAttempts[email];
        }, 3600000); // 1 heure
    }

    return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
}

async function sendAccountBlockedEmail(email) {
    const emailContent = 'Votre compte est temporairement bloqué. Réessayez plus tard.';
    await sendEmail(email, 'Compte Temporairement Bloqué', emailContent);
}

async function register(req, res, next) {
    const { role, email, lastName, firstName, password, password_confirm, newsletter  } = req.body;

    if (!role || !email || !firstName || !lastName || !password || !password_confirm) {
        return res.status(422).json({ message: 'Tous les champs sont obligatoires' });
    }

    if (password !== password_confirm) {
        return res.status(422).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.createUser({
            firstname: firstName,
            lastname: lastName,
            email,
            password: hashedPassword,
            role,
            newsletter: newsletter || false,
        });

        await newUser.save();

        if (newsletter) {
            await sendEmail(email, 'Inscription à la Newsletter', 'Vous avez souscrit à la newsletter. Vous recevrez des emails pour vous prévenir des promotions ou des nouveaux produits.');
        }

        return res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        next(error);
    }
}

async function confirmEmail(req, res) {
    const { token } = req.params;

    try {
        const result = await User.updateUserByToken(token, { confirmed: true });

        if (result.length === 0) {
            return res.status(400).json({ message: 'Token invalide ou expiré' });
        }

        res.status(200).json({ message: 'Email confirmé avec succès' });
    } catch (error) {
        console.error('Error confirming email:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ message: 'Tous les champs sont obligatoires' });
    }

    try {
        const user = await User.getUserByEmail(email);

        if (!user) {
            return handleFailedLoginAttempt(email, res);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return handleFailedLoginAttempt(email, res);
        }

        delete loginAttempts[email];

        const accessToken = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie('token', accessToken, { httpOnly: true, secure: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

        const responseMessage = user.role === 'admin'
            ? { message: 'Connecté en tant qu\'administrateur', accessToken, refreshToken, user, redirectTo: '/' }
            : { message: 'Bonjour ! Votre utilisateur est connecté', accessToken, refreshToken, user };

        return res.status(200).json(responseMessage);
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        return res.status(500).json({ message: 'Erreur interne du serveur' });
    }
}

async function refreshToken(req, res) {
    const { refreshToken: receivedRefreshToken } = req.body;
    if (!receivedRefreshToken) {
        return res.status(401).json({ message: 'Token de rafraîchissement manquant' });
    }

    try {
        const decoded = jwt.verify(receivedRefreshToken, REFRESH_TOKEN_SECRET);
        const user = await User.getUserById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }

        const newAccessToken = generateToken(user);
        const newRefreshToken = generateRefreshToken(user);

        res.cookie('token', newAccessToken, { httpOnly: true, secure: true });
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });

        return res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.error('Erreur lors du rafraîchissement du token :', error);
        return res.status(403).json({ message: 'Token de rafraîchissement invalide ou expiré' });
    }
}

async function requestPasswordReset(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(422).json({ message: 'Email requis' });
    }

    try {
        const user = await User.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'Email non trouvé' });
        }

        const currentDate = new Date();
        let resetTokenExpiry;
        if (user.password_last_changed) {
            const passwordChangedDate = new Date(user.password_last_changed);
            passwordChangedDate.setDate(passwordChangedDate.getDate() + 60);
            resetTokenExpiry = passwordChangedDate;
        } else {
            const accountCreatedDate = new Date(user.account_created_at);
            accountCreatedDate.setDate(accountCreatedDate.getDate() + 60);
            resetTokenExpiry = accountCreatedDate;
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        await User.updateUserByEmail(email, { reset_token: resetToken, reset_token_expiry: resetTokenExpiry });

        const resetLink = `${process.env.FRONTEND_BASE_URL}/reset-password/${resetToken}`;
        const emailContent = `Pour réinitialiser votre mot de passe, veuillez cliquer sur ce lien : ${resetLink}`;

        await sendEmail(email, 'Réinitialisation de mot de passe', emailContent);

        res.status(200).json({ message: 'Email de réinitialisation envoyé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la demande de réinitialisation de mot de passe :', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function resetPassword(req, res) {
    const { token, newPassword, newPasswordConfirm } = req.body;

    if (!token || !newPassword || !newPasswordConfirm) {
        return res.status(422).json({ message: 'Tous les champs sont obligatoires' });
    }

    if (newPassword !== newPasswordConfirm) {
        return res.status(422).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    try {
        const result = await User.updateUserByToken(token, {
            password: await bcrypt.hash(newPassword, 10),
            reset_token: null,
            reset_token_expiry: null
        });

        if (result[0] === 0) {
            return res.status(400).json({ message: 'Token invalide ou expiré' });
        }

        res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

function logout(req, res) {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Utilisateur déconnecté' });
}

async function user(req, res) {
    try {
        const result = await User.getUsers();
        res.status(200).json({ users: result.rows });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { register, login, logout, user, confirmEmail, resetPassword, requestPasswordReset, refreshToken };
