import AlertService from '../services/AlertService.js';
import ProductModel from '../models/mongo_models/Product.js';
import User from '../models/postgres_models/UserPg.js';
import Alert from '../models/postgres_models/Alert.js';
import EmailService from '../utils/emailService.js';

/**
 * Contrôleur pour tester les fonctionnalités d'alertes
 * ⚠️ À utiliser uniquement en environnement de développement
 */
class TestAlertController {
  /**
   * Simule un changement de prix et envoie des notifications aux utilisateurs abonnés
   */
  async simulatePriceChange(req, res) {
    try {
      if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ message: 'Cette route est désactivée en production' });
      }

      const { productId } = req.body;
      if (!productId) {
        return res.status(400).json({ message: 'L\'ID du produit est requis' });
      }

      // Récupération du produit
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }

      // Récupération des alertes pour ce produit
      const alerts = await Alert.findAll({
        where: {
          product_id: productId,
          type: 'price_change',
          is_active: true
        }
      });

      if (alerts.length === 0) {
        return res.status(200).json({ message: 'Aucune alerte active pour ce produit' });
      }

      // Récupérer les utilisateurs concernés
      const userIds = [...new Set(alerts.map(alert => alert.user_id))];
      const users = await User.findAll({
        where: {
          id: userIds
        }
      });

      // Envoyer les emails
      const emailPromises = [];
      for (const user of users) {
        emailPromises.push(
          EmailService.sendPriceChangeAlert({
            email: user.email,
            firstName: user.first_name || 'Client',
            productName: product.name,
            oldPrice: product.price,
            newPrice: product.price * 0.9, // Simulation d'une réduction de 10%
            productId: product._id
          })
        );
      }

      await Promise.all(emailPromises);

      // Mettre à jour les alertes (date d'envoi)
      await Promise.all(
        alerts.map(alert => 
          alert.update({ last_sent: new Date() })
        )
      );

      return res.status(200).json({ 
        message: `${emailPromises.length} emails d'alerte de changement de prix envoyés avec succès` 
      });
    } catch (error) {
      console.error('Erreur lors de la simulation d\'alerte de prix:', error);
      return res.status(500).json({ message: 'Erreur lors de la simulation', error: error.message });
    }
  }

  /**
   * Simule un réapprovisionnement et envoie des notifications aux utilisateurs abonnés
   */
  async simulateRestock(req, res) {
    try {
      if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ message: 'Cette route est désactivée en production' });
      }

      const { productId } = req.body;
      if (!productId) {
        return res.status(400).json({ message: 'L\'ID du produit est requis' });
      }

      // Récupération du produit
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }

      // Récupération des alertes pour ce produit
      const alerts = await Alert.findAll({
        where: {
          product_id: productId,
          type: 'restock',
          is_active: true
        }
      });

      if (alerts.length === 0) {
        return res.status(200).json({ message: 'Aucune alerte active pour ce produit' });
      }

      // Récupérer les utilisateurs concernés
      const userIds = [...new Set(alerts.map(alert => alert.user_id))];
      const users = await User.findAll({
        where: {
          id: userIds
        }
      });

      // Envoyer les emails
      const emailPromises = [];
      for (const user of users) {
        emailPromises.push(
          EmailService.sendRestockAlert({
            email: user.email,
            firstName: user.first_name || 'Client',
            productName: product.name,
            productId: product._id,
            quantity: 10 // Simulation d'un réapprovisionnement de 10 unités
          })
        );
      }

      await Promise.all(emailPromises);

      // Désactiver les alertes de réapprovisionnement (car elles sont à usage unique)
      await Promise.all(
        alerts.map(alert => 
          alert.update({ 
            is_active: false,
            last_sent: new Date() 
          })
        )
      );

      return res.status(200).json({ 
        message: `${emailPromises.length} emails d'alerte de réapprovisionnement envoyés avec succès` 
      });
    } catch (error) {
      console.error('Erreur lors de la simulation d\'alerte de réapprovisionnement:', error);
      return res.status(500).json({ message: 'Erreur lors de la simulation', error: error.message });
    }
  }

  /**
   * Teste l'envoi d'un email de renouvellement de mot de passe
   */
  async testPasswordRenewalEmail(req, res) {
    try {
      if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ message: 'Cette route est désactivée en production' });
      }

      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: 'L\'ID utilisateur est requis' });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Générer un token de réinitialisation
      const token = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15);
      
      // Date d'expiration (24h)
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 24);

      // Stocker le token dans l'utilisateur
      await user.update({
        reset_password_token: token,
        reset_password_expires: expirationDate,
        password_renewal_notified: true
      });

      // Envoyer l'email
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
      
      await EmailService.sendPasswordRenewalReminder({
        email: user.email,
        firstName: user.first_name || 'Client',
        resetUrl,
        expirationHours: 24
      });

      return res.status(200).json({ 
        message: 'Email de renouvellement de mot de passe envoyé avec succès' 
      });
    } catch (error) {
      console.error('Erreur lors du test d\'email de renouvellement:', error);
      return res.status(500).json({ message: 'Erreur lors du test', error: error.message });
    }
  }
}

export default new TestAlertController();
