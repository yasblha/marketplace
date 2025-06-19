import User from '../models/postgres_models/UserPg.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendEmail } from '../services/mailer.js';
// Charger dotenv si pas déjà fait
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.JWT_SECRET) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

const JWT_SECRET = process.env.JWT_SECRET;

// Log pour le débogage
console.log('AuthController - JWT_SECRET:', JWT_SECRET ? '*** (défini)' : 'NON DÉFINI');
console.log('NODE_ENV:', process.env.NODE_ENV);

// Vérifier et définir REFRESH_TOKEN_SECRET avec une valeur par défaut si nécessaire
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;

// Log pour le débogage
console.log('REFRESH_TOKEN_SECRET:', REFRESH_TOKEN_SECRET ? '*** (défini)' : 'NON DÉFINI');

if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
  console.error('ERREUR: JWT_SECRET ou REFRESH_TOKEN_SECRET non défini');
  console.error('JWT_SECRET:', JWT_SECRET ? 'défini' : 'non défini');
  console.error('REFRESH_TOKEN_SECRET:', REFRESH_TOKEN_SECRET ? 'défini' : 'non défini');
}

function isPasswordStrong(password) {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
}

export function generateToken(user) {
    if (!user.role) {
        throw new Error('User role is not defined');
    }
    return jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '60m' });
}

export function generateRefreshToken(user) {
    try {
        console.log('Valeur de REFRESH_TOKEN_SECRET dans generateRefreshToken:', 
            REFRESH_TOKEN_SECRET ? '*** (défini)' : 'NON DÉFINI');
            
        if (!REFRESH_TOKEN_SECRET) {
            console.error('ERREUR: REFRESH_TOKEN_SECRET est indéfini');
            console.error('Type de REFRESH_TOKEN_SECRET:', typeof REFRESH_TOKEN_SECRET);
            console.error('Valeur de process.env.REFRESH_TOKEN_SECRET:', 
                process.env.REFRESH_TOKEN_SECRET ? '*** (défini)' : 'NON DÉFINI');
            throw new Error('REFRESH_TOKEN_SECRET is not defined');
        }
        if (!user || !user.id) {
            throw new Error('User or user.id is not defined');
        }
        return jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    } catch (error) {
        console.error('Erreur dans generateRefreshToken:');
        console.error('- Message:', error.message);
        console.error('- REFRESH_TOKEN_SECRET:', REFRESH_TOKEN_SECRET ? 'défini' : 'non défini');
        console.error('- User:', user ? 'défini' : 'non défini');
        if (user) {
            console.error('- User ID:', user.id || 'non défini');
        }
        throw error; // Propager l'erreur pour une gestion ultérieure
    }
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

export async function register(req, res, next) {
    const { role, email, lastName, firstName, password, password_confirm } = req.body;

    if (!role || !email || !firstName || !lastName || !password || !password_confirm) {
        return res.status(422).json({ message: 'Tous les champs sont obligatoires' });
    }

    if (password !== password_confirm) {
        return res.status(422).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    if (!isPasswordStrong(password)) {
        return res.status(422).json({ message: 'Le mot de passe doit comporter au moins 8 caracteres, avec chiffres, lettres majuscules et minuscules.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const confirmationToken = crypto.randomBytes(32).toString('hex');
        const confirmationTokenExpiry = new Date();
        confirmationTokenExpiry.setHours(confirmationTokenExpiry.getHours() + 24);

        const newUser = await User.create({
            firstname: firstName,
            lastname: lastName,
            email,
            password: hashedPassword,
            role,
            confirmation_token: confirmationToken,
            confirmation_token_expiry: confirmationTokenExpiry,
            confirmed: false,
        });

        const confirmLink = `${process.env.FRONTEND_BASE_URL}/confirm-email/${confirmationToken}`;
        const emailContent = `Pour confirmer votre inscription, veuillez cliquer sur ce lien : ${confirmLink}`;
        await sendEmail(email, 'Confirmation de votre inscription', emailContent);

        return res.status(201).json({ message: 'Utilisateur créé avec succès. Veuillez vérifier votre email pour confirmer votre inscription.' });
    } catch (error) {
        console.error('Error creating user:', error);
        next(error);
    }
}

export async function confirmEmail(req, res) {
    const { token } = req.params;

    try {
        const user = await User.findOne({ where: { confirmation_token: token } });

        if (!user || new Date() > new Date(user.confirmation_token_expiry)) {
            return res.status(400).json({ message: 'Token invalide ou expiré' });
        }

        user.confirmed = true;
        user.confirmation_token = null;
        user.confirmation_token_expiry = null;
        await user.save();

        res.status(200).json({ message: 'Email confirmé avec succès' });
    } catch (error) {
        console.error('Error confirming email:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

export async function login(req, res) {
    console.log('Début de la fonction login');
    console.log('Corps de la requête:', JSON.stringify(req.body, null, 2));
    
    const { email, password } = req.body;

    if (!email || !password) {
        console.log('Champs manquants dans la requête');
        return res.status(422).json({ message: 'Tous les champs sont obligatoires' });
    }

    try {
        console.log('Recherche de l\'utilisateur avec email:', email);
        const user = await User.findOne({ where: { email } });
        console.log('Utilisateur trouvé:', user ? 'Oui' : 'Non');

        if (!user) {
            console.log('Aucun utilisateur trouvé avec cet email');
            return handleFailedLoginAttempt(email, res);
        }

        console.log('Vérification du mot de passe');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Mot de passe valide:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('Mot de passe incorrect');
            return handleFailedLoginAttempt(email, res);
        }

        console.log('Vérification de la confirmation du compte');
        if (!user.confirmed) {
            const confirmationToken = user.confirmation_token || crypto.randomBytes(32).toString('hex');
            user.confirmation_token = confirmationToken;
            await user.save();

            const confirmLink = `${process.env.FRONTEND_BASE_URL}/confirm-email/${confirmationToken}`;
            const emailContent = `Pour confirmer votre inscription, veuillez cliquer sur ce lien : ${confirmLink}`;
            await sendEmail(email, 'Confirmation de votre inscription', emailContent);

            return res.status(403).json({ message: 'Veuillez confirmer votre email avant de vous connecter. Un nouveau lien de confirmation a été envoyé à votre adresse email.' });
        }

        delete loginAttempts[email];

        console.log('Génération du token d\'accès...');
        const accessToken = generateToken(user);
        console.log('Token d\'accès généré avec succès');
        
        console.log('Génération du refresh token...');
        const refreshToken = generateRefreshToken(user);
        console.log('Refresh token généré avec succès');

        console.log('Configuration des cookies...');
        res.cookie('token', accessToken, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000 // 1 heure
        });
        
        res.cookie('refreshToken', refreshToken, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
        });

        console.log('Préparation de la réponse...');
        const responseMessage = user.role === 'admin'
            ? { 
                message: 'Connecté en tant qu\'administrateur', 
                accessToken, 
                refreshToken, 
                user: { 
                    id: user.id, 
                    email: user.email, 
                    role: user.role,
                    firstname: user.firstname,
                    lastname: user.lastname
                }, 
                redirectTo: '/admin' 
            }
            : { 
                message: 'Bonjour ! Votre utilisateur est connecté', 
                accessToken, 
                refreshToken, 
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    firstname: user.firstname,
                    lastname: user.lastname
                },
                redirectTo: '/' 
            };

        console.log('Envoi de la réponse...');
        return res.status(200).json(responseMessage);
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        console.error('Stack:', error.stack);
        return res.status(500).json({ 
            message: 'Erreur interne du serveur',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export async function refreshToken(req, res) {
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

export async function requestPasswordReset(req, res) {
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

export async function resetPassword(req, res) {
    const { token, newPassword, newPasswordConfirm } = req.body;

    if (!token || !newPassword || !newPasswordConfirm) {
        return res.status(422).json({ message: 'Tous les champs sont obligatoires' });
    }

    if (newPassword !== newPasswordConfirm) {
        return res.status(422).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    if (!isPasswordStrong(newPassword)) {
        return res.status(422).json({ message: 'Le mot de passe doit comporter au moins 12 caracteres, avec chiffres, lettres majuscules et minuscules et symboles.' });
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

export async function users(req, res) {
    try {
        const result = await User.getUsers();
        res.status(200).json({ users: result });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function user(req, res) {
    const { userId } = req.user;

    try {
        const user = await User.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function updateUser(req, res) {
    const { id } = req.params;
    const { firstName, lastName, email, role, password } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        user.firstname = firstName || user.firstname;
        user.lastname = lastName || user.lastname;
        user.email = email || user.email;
        user.role = role || user.role;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        res.status(200).json({ message: 'Utilisateur mis à jour avec succès', user });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
}

export async function impersonateUser(req, res) {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        const accessToken = generateToken(user);
        const refreshToken = generateRefreshToken(user);
        res.status(200).json({ accessToken, refreshToken, user });
    } catch (error) {
        console.error('Erreur impersonate user:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
}

export default {
  user,
  register,
  login,
  logout,
  users,
  confirmEmail,
  resetPassword,
  requestPasswordReset,
  refreshToken,
  updateUser,
  impersonateUser,
  generateToken,
  generateRefreshToken
};
