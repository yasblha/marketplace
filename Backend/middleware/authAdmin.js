import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

function authenticateAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log('No authorization header provided');
        return res.status(401).json({ message: 'Non autorisé' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log('No token found in authorization header');
        return res.status(401).json({ message: 'Non autorisé' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded token:', decoded);

        if (!decoded.role) {
            console.log('No role found in decoded token');
            return res.status(403).json({ message: 'Accès refusé. Cette route est réservée aux administrateurs.' });
        }

        if (decoded.role !== 'admin') {
            console.log('User is not an admin:', decoded.role);
            return res.status(403).json({ message: 'Accès refusé. Cette route est réservée aux administrateurs.' });
        }

        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        console.log('Invalid token:', error);
        return res.status(401).json({ message: 'Token invalide' });
    }
}

function authenticateCompta(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Non autorisé' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Non autorisé' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'ROLE_COMPTA' && decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Accès refusé.' });
        }
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token invalide' });
    }
}

function authenticateToken(req, res, next) {
    const authHeader = req.header('Authorization');
    const token = authHeader ? authHeader.split(' ')[1] : req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Token manquant, authentification requise' });

    try {
        console.log('Token reçu:', token);
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Token décodé:', decoded);
        
        // Structure uniforme pour req.user
        req.user = { 
            userId: decoded.userId || decoded.id || (decoded.user ? decoded.user.id : null),
            role: decoded.role || (decoded.user ? decoded.user.role : null)
        };
        console.log('User authenticated:', req.user);
        next();
    } catch (error) {
        console.error('Erreur d\'authentification:', error);
        return res.status(403).json({ message: 'Token invalide ou expiré' });
    }
}

export { authenticateAdmin, authenticateCompta, authenticateToken };
