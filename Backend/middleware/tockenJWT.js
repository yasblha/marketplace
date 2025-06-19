import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const { JWT_SECRET } = process.env;

export default function(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Accès refusé, token manquant' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        console.error('Erreur de vérification du token:', error.message);
        return res.status(401).json({ message: 'Token invalide' });
    }
};
