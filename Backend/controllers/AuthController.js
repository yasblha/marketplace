const User = require('../models/postgres_models/UserPg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendEmail } = require('../services/mailer');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

let loginAttempts = {};



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

        const newUser = await User.createUser({
            firstname: firstName,
            lastname: lastName,
            email,
            password: hashedPassword,
            role,
        });

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
        console.log(user);

        if (!user) {
            return handleFailedLoginAttempt(email);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return handleFailedLoginAttempt(email);
        }
        delete loginAttempts[email];

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true });


        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|\\;:'",.<>\/?]).{12,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(422).json({
                message: 'Le mot de passe doit contenir au moins 12 caractères avec au moins une lettre majuscule, une lettre minuscule, un chiffre et un symbole'
            });
        }

        if(user.role === 'admin') {
            return res.status(200).json({ message: 'Connecté en tant qu\'administrateur', token, redirectTo: '/admin/dashboard' });
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
        const user = await User.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'Email non trouvé' });
        }

        const currentDate = new Date();

        // Date limite pour renouveler le mot de passe 60 jours
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

        const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
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

async function handleFailedLoginAttempt(email) {
    try {
        if (loginAttempts[email] && loginAttempts[email] >= 3) {
            return { success: false, message: 'Votre compte est temporairement bloqué. Réessayez plus tard.' };
        }

        loginAttempts[email] = (loginAttempts[email] || 0) + 1;

        if (loginAttempts[email] >= 3) {
            setTimeout(() => {
                delete loginAttempts[email];
            }, 3600000);

            await sendAccountBlockedEmail(email, Date.now() + 3600000);
        }

        return { success: false, message: 'Email ou mot de passe incorrect' };

    } catch (error) {
        console.error('Erreur lors de la gestion des tentatives de connexion :', error);
        return { success: false, message: 'Une erreur s\'est produite lors de la tentative de connexion.' };
    }
}

async function sendAccountBlockedEmail(email, blockUntil) {
    const emailContent = `Votre compte est temporairement bloqué. Réessayez plus tard.`;
    await sendEmail(email, 'Compte Temporairement Bloqué', emailContent);
}

module.exports = { getUser, register, login, logout, refresh, user, confirmEmail, resetPassword, requestPasswordReset };