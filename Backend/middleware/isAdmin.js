import User from '../models/postgres_models/UserPg.js';

/**
 * Middleware pour vérifier si l'utilisateur est administrateur
 * Doit être utilisé après le middleware authenticateToken
 */
const isAdmin = async (req, res, next) => {
  try {
    // Vérifier que req.user existe (authenticateToken doit être utilisé avant)
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    // Récupérer l'utilisateur depuis la base de données
    const user = await User.findByPk(req.user.userId);

    // Vérifier si l'utilisateur existe et est un administrateur
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès interdit - Droits administrateur requis' });
    }

    // Si tout est OK, passer au middleware suivant
    next();
  } catch (error) {
    console.error('Erreur lors de la vérification des droits admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export default isAdmin;
