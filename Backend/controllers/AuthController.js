const User = require('../models/UserPg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

/*const jwtSecret = 'your_jwt_secret';
const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
    },
});

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to,
        subject,
        text,
    };

    emailTransporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};*/

async function register(req, res, next) {
    const { role, email, lastName, firstName, password, password_confirm } = req.body;

    if (!role || !email || !firstName || !lastName || !password || !password_confirm) {
        return res.status(422).json({ message: 'Tous les champs sont obligatoires' });
    }

    if (password !== password_confirm) {
        return res.status(422).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.createUser({ firstname: firstName, lastname: lastName, email, password: hashedPassword, role });
        return res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
    } catch (error) {
        next(error);
    }
}

async function confirmEmail(req, res) {
    const { token } = req.params;

    try {
        const result = await User.updateUserByToken(token, { confirmed: true });

        if (result.rowCount === 0) {
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
        const user = await User.getUser(email, password);
        console.log(user);

        if (!user) {
            return res.status(404).json({ message: 'Email ou mot de passe incorrect' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log(password, user.password);
            return res.status(404).json({ message: 'Email ou mot de passe incorrect' });
        } else {
            console.log(true, 'cest correct')
        }

        res.status(200).json({ message: 'Bonjour ! Votre utilisateur est connecté' });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
}

async function requestPasswordReset(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(422).json({ message: 'Email requis' });
    }

    try {
        const result = await User.getUserByEmail(email);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Email non trouvé' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        await User.updateUserByEmail(email, { reset_token: resetToken, reset_token_expiry: resetTokenExpiry });

        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        sendEmail(email, 'Réinitialisation du mot de passe', `Cliquez sur ce lien pour réinitialiser votre mot de passe: ${resetUrl}`);

        res.status(200).json({ message: 'Email de réinitialisation envoyé' });
    } catch (error) {
        console.error('Error requesting password reset:', error);
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
        const result = await User.updateUserByToken(token, { reset_token_expiry: { $gt: Date.now() } });

        if (result.rowCount === 0) {
            return res.status(400).json({ message: 'Token invalide ou expiré' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updateUserByToken(token, { password: hashedPassword, reset_token: null, reset_token_expiry: null });

        res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

function logout(req, res) {
    res.send({
        message: 'Bonjour ! Votre utilisateur est déconnecté'
    });
}

async function refresh(req, res) {
    res.clearCookie('token');
    res.status(200).json({ message: 'Utilisateur déconnecté' });
}

async function user(req, res) {
    try {
        const result = await User.getUsers();
        res.status(200).json({ message: `Users trouvés: ${JSON.stringify(result.rows)}`, result: result.rows });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getUser(req, res) {
    const { email, password } = req.body;
    return user = await User.getUser(email);
}

module.exports = { getUser, register, login, logout, refresh, user, confirmEmail, resetPassword, requestPasswordReset };