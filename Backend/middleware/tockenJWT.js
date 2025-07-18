import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const { JWT_SECRET } = process.env;

export default function(req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Accès refusé, token manquant' });
    }

    try {
        // Vérifier si le token utilise le format Bearer
        let token = authHeader;
        if (authHeader.startsWith('Bearer ')) {
            // Extraire le token après "Bearer "
            token = authHeader.substring(7);
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Corriger la structure : le payload contient directement userId et role
        // au lieu de les avoir dans un objet 'user'
        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };
        
        next();
    } catch (error) {
        console.error('Erreur de vérification du token:', error.message);
        return res.status(401).json({ message: 'Token invalide' });
    }
};
