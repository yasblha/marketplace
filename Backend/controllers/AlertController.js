import Alert from '../models/postgres_models/Alert.js';
import StockAlert from '../models/postgres_models/StockAlert.js';
import AlertService from '../services/AlertService.js';

async function createAlert(req, res) {
  try {
    const userId = req.user.userId;
    const alertData = req.body;

    const alert = await AlertService.createAlert(userId, alertData);
    res.status(201).json({
      message: 'Alerte créée avec succès',
      alert
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'alerte:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de l\'alerte',
      error: error.message 
    });
  }
}

async function getUserAlerts(req, res) {
  try {
    const userId = req.user.userId;
    const alerts = await AlertService.getUserAlerts(userId);
    
    res.status(200).json({
      alerts
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des alertes:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des alertes',
      error: error.message 
    });
  }
}

async function updateAlert(req, res) {
  try {
    const userId = req.user.userId;
    const alertId = req.params.id;
    const updateData = req.body;

    const alert = await AlertService.updateAlert(alertId, userId, updateData);
    res.status(200).json({
      message: 'Alerte mise à jour avec succès',
      alert
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'alerte:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de l\'alerte',
      error: error.message 
    });
  }
}

async function deleteAlert(req, res) {
  try {
    const userId = req.user.userId;
    const alertId = req.params.id;

    const result = await AlertService.deleteAlert(alertId, userId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'alerte:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de l\'alerte',
      error: error.message 
    });
  }
}

async function toggleAlert(req, res) {
  try {
    const userId = req.user.userId;
    const alertId = req.params.id;
    const { is_active } = req.body;

    const alert = await AlertService.updateAlert(alertId, userId, { is_active });
    res.status(200).json({
      message: `Alerte ${is_active ? 'activée' : 'désactivée'} avec succès`,
      alert
    });
  } catch (error) {
    console.error('Erreur lors de la modification du statut de l\'alerte:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la modification du statut de l\'alerte',
      error: error.message 
    });
  }
}

async function subscribeNewsletter(req, res) {
  try {
    const userId = req.user.userId;
    
    // Vérifier si l'utilisateur est déjà abonné
    const existingAlert = await AlertService.getUserAlerts(userId);
    const newsletterAlert = existingAlert.find(alert => alert.type === 'newsletter');
    
    if (newsletterAlert) {
      if (newsletterAlert.is_active) {
        return res.status(400).json({ 
          message: 'Vous êtes déjà abonné à la newsletter' 
        });
      } else {
        // Réactiver l'abonnement
        await AlertService.updateAlert(newsletterAlert.id, userId, { is_active: true });
        return res.status(200).json({ 
          message: 'Abonnement à la newsletter réactivé' 
        });
      }
    }

    // Créer un nouvel abonnement
    await AlertService.createAlert(userId, { type: 'newsletter' });
    res.status(201).json({
      message: 'Abonnement à la newsletter créé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'abonnement à la newsletter:', error);
    res.status(500).json({ 
      message: 'Erreur lors de l\'abonnement à la newsletter',
      error: error.message 
    });
  }
}

async function unsubscribeNewsletter(req, res) {
  try {
    const userId = req.user.userId;
    
    const existingAlert = await AlertService.getUserAlerts(userId);
    const newsletterAlert = existingAlert.find(alert => alert.type === 'newsletter');
    
    if (!newsletterAlert) {
      return res.status(404).json({ 
        message: 'Aucun abonnement à la newsletter trouvé' 
      });
    }

    await AlertService.updateAlert(newsletterAlert.id, userId, { is_active: false });
    res.status(200).json({
      message: 'Désabonnement de la newsletter effectué avec succès'
    });
  } catch (error) {
    console.error('Erreur lors du désabonnement de la newsletter:', error);
    res.status(500).json({ 
      message: 'Erreur lors du désabonnement de la newsletter',
      error: error.message 
    });
  }
}

async function createRestockAlert(req, res) {
  try {
    const userId = req.user.userId;
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ 
        message: 'ID du produit requis' 
      });
    }

    // Vérifier si l'alerte existe déjà
    const existingAlerts = await AlertService.getUserAlerts(userId);
    const existingAlert = existingAlerts.find(alert => 
      alert.type === 'restock' && alert.product_id === product_id
    );

    if (existingAlert) {
      if (existingAlert.is_active) {
        return res.status(400).json({ 
          message: 'Vous avez déjà une alerte active pour ce produit' 
        });
      } else {
        // Réactiver l'alerte
        await AlertService.updateAlert(existingAlert.id, userId, { is_active: true });
        return res.status(200).json({ 
          message: 'Alerte de restock réactivée' 
        });
      }
    }

    // Créer une nouvelle alerte
    await AlertService.createAlert(userId, { 
      type: 'restock',
      product_id 
    });
    
    res.status(201).json({
      message: 'Alerte de restock créée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'alerte de restock:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de l\'alerte de restock',
      error: error.message 
    });
  }
}

async function createPriceChangeAlert(req, res) {
  try {
    const userId = req.user.userId;
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ 
        message: 'ID du produit requis' 
      });
    }

    // Vérifier si l'alerte existe déjà
    const existingAlerts = await AlertService.getUserAlerts(userId);
    const existingAlert = existingAlerts.find(alert => 
      alert.type === 'price_change' && alert.product_id === product_id
    );

    if (existingAlert) {
      if (existingAlert.is_active) {
        return res.status(400).json({ 
          message: 'Vous avez déjà une alerte active pour ce produit' 
        });
      } else {
        // Réactiver l'alerte
        await AlertService.updateAlert(existingAlert.id, userId, { is_active: true });
        return res.status(200).json({ 
          message: 'Alerte de changement de prix réactivée' 
        });
      }
    }

    // Créer une nouvelle alerte
    await AlertService.createAlert(userId, { 
      type: 'price_change',
      product_id 
    });
    
    res.status(201).json({
      message: 'Alerte de changement de prix créée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'alerte de changement de prix:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de l\'alerte de changement de prix',
      error: error.message 
    });
  }
}

async function createNewProductAlert(req, res) {
  try {
    const userId = req.user.userId;
    const { category } = req.body;

    // Vérifier si l'alerte existe déjà
    const existingAlerts = await AlertService.getUserAlerts(userId);
    const existingAlert = existingAlerts.find(alert => 
      alert.type === 'new_product' && alert.category === category
    );

    if (existingAlert) {
      if (existingAlert.is_active) {
        return res.status(400).json({ 
          message: `Vous avez déjà une alerte active pour les nouveaux produits de la catégorie ${category}` 
        });
      } else {
        // Réactiver l'alerte
        await AlertService.updateAlert(existingAlert.id, userId, { is_active: true });
        return res.status(200).json({ 
          message: 'Alerte de nouveaux produits réactivée' 
        });
      }
    }

    // Créer une nouvelle alerte
    await AlertService.createAlert(userId, { 
      type: 'new_product',
      category 
    });
    
    res.status(201).json({
      message: 'Alerte de nouveaux produits créée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'alerte de nouveaux produits:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de l\'alerte de nouveaux produits',
      error: error.message 
    });
  }
}

export default {
  createAlert,
  getUserAlerts,
  updateAlert,
  deleteAlert,
  toggleAlert,
  subscribeNewsletter,
  unsubscribeNewsletter,
  createRestockAlert,
  createPriceChangeAlert,
  createNewProductAlert
};
