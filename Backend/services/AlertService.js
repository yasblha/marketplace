import Alert from '../models/postgres_models/Alert.js';
import User from '../models/postgres_models/UserPg.js';
import Product from '../models/mongo_models/Product.js';
import { sendEmail } from '../utils/emailService.js';

class AlertService {
  // Créer une nouvelle alerte
  static async createAlert(userId, alertData) {
    try {
      // Vérification de la présence d'un product_id pour les alertes liées aux produits
      if (['price_change', 'restock'].includes(alertData.type) && !alertData.product_id) {
        throw new Error(`L'identifiant du produit (product_id) est obligatoire pour les alertes de type ${alertData.type}`);
      }

      const alert = await Alert.create({
        user_id: userId,
        type: alertData.type,
        category: alertData.category,
        product_id: alertData.product_id,
        is_active: true
      });
      return alert;
    } catch (error) {
      console.error('Erreur lors de la création de l\'alerte:', error);
      throw error;
    }
  }

  // Obtenir toutes les alertes d'un utilisateur
  static async getUserAlerts(userId) {
    try {
      const alerts = await Alert.findAll({
        where: { user_id: userId },
        include: [{
          model: User,
          as: 'user',
          attributes: ['email', 'firstname', 'lastname']
        }],
        order: [['created_at', 'DESC']]
      });
      return alerts;
    } catch (error) {
      console.error('Erreur lors de la récupération des alertes:', error);
      throw error;
    }
  }

  // Mettre à jour une alerte
  static async updateAlert(alertId, userId, updateData) {
    try {
      const alert = await Alert.findOne({
        where: { id: alertId, user_id: userId }
      });
      
      if (!alert) {
        throw new Error('Alerte non trouvée');
      }

      await alert.update(updateData);
      return alert;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'alerte:', error);
      throw error;
    }
  }

  // Supprimer une alerte
  static async deleteAlert(alertId, userId) {
    try {
      const alert = await Alert.findOne({
        where: { id: alertId, user_id: userId }
      });
      
      if (!alert) {
        throw new Error('Alerte non trouvée');
      }

      await alert.destroy();
      return { message: 'Alerte supprimée avec succès' };
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'alerte:', error);
      throw error;
    }
  }

  // Vérifier et envoyer les alertes de nouveaux produits
  static async checkNewProductAlerts() {
    try {
      // Récupérer les alertes de nouveaux produits actives
      const alerts = await Alert.findAll({
        where: { 
          type: 'new_product',
          is_active: true 
        },
        include: [{
          model: User,
          as: 'user',
          attributes: ['email', 'firstname', 'lastname']
        }]
      });

      // Récupérer les nouveaux produits (créés dans les dernières 24h)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const newProducts = await Product.find({
        created_at: { $gte: yesterday }
      });

      for (const alert of alerts) {
        const user = alert.user;
        
        // Filtrer les produits par catégorie si spécifiée
        let productsToNotify = newProducts;
        if (alert.category) {
          productsToNotify = newProducts.filter(p => p.category === alert.category);
        }

        if (productsToNotify.length > 0) {
          await this.sendNewProductAlert(user, productsToNotify, alert.category);
          
          // Mettre à jour la date d'envoi
          await alert.update({ last_sent: new Date() });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des alertes nouveaux produits:', error);
    }
  }

  // Vérifier et envoyer les alertes de restock
  static async checkRestockAlerts() {
    try {
      const alerts = await Alert.findAll({
        where: { 
          type: 'restock',
          is_active: true 
        },
        include: [{
          model: User,
          as: 'user',
          attributes: ['email', 'firstname', 'lastname']
        }]
      });

      for (const alert of alerts) {
        if (alert.product_id) {
          const product = await Product.findById(alert.product_id);
          if (product && product.stock_available > 0) {
            const user = alert.user;
            await this.sendRestockAlert(user, product);
            await alert.update({ last_sent: new Date() });
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des alertes restock:', error);
    }
  }

  // Vérifier et envoyer les alertes de changement de prix
  static async checkPriceChangeAlerts() {
    try {
      const alerts = await Alert.findAll({
        where: { 
          type: 'price_change',
          is_active: true 
        },
        include: [{
          model: User,
          as: 'user',
          attributes: ['email', 'firstname', 'lastname']
        }]
      });

      for (const alert of alerts) {
        if (alert.product_id) {
          const product = await Product.findById(alert.product_id);
          if (product) {
            // Vérifier si le prix a changé depuis la dernière alerte
            const lastSent = alert.last_sent;
            if (!lastSent || product.updated_at > lastSent) {
              const user = alert.user;
              await this.sendPriceChangeAlert(user, product);
              await alert.update({ last_sent: new Date() });
            }
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des alertes changement de prix:', error);
    }
  }

  // Envoyer une alerte de nouveaux produits
  static async sendNewProductAlert(user, products, category) {
    const subject = category 
      ? `Nouveaux produits dans la catégorie ${category}`
      : 'Nouveaux produits disponibles';
    
    const productList = products.map(p => 
      `- ${p.name} : ${p.price}€`
    ).join('\n');
    
    const html = `
      <h2>Bonjour ${user.firstname},</h2>
      <p>De nouveaux produits sont disponibles sur notre site :</p>
      <ul>
        ${products.map(p => `<li><strong>${p.name}</strong> : ${p.price}€</li>`).join('')}
      </ul>
      <p><a href="${process.env.FRONTEND_URL}/products">Voir tous les produits</a></p>
    `;

    await sendEmail({
      to: user.email,
      subject,
      html
    });
  }

  // Envoyer une alerte de restock
  static async sendRestockAlert(user, product) {
    const subject = `${product.name} est de nouveau en stock !`;
    
    const html = `
      <h2>Bonjour ${user.firstname},</h2>
      <p>Le produit <strong>${product.name}</strong> est de nouveau disponible en stock !</p>
      <p>Prix : ${product.price}€</p>
      <p><a href="${process.env.FRONTEND_URL}/product/${product._id}">Voir le produit</a></p>
    `;

    await sendEmail({
      to: user.email,
      subject,
      html
    });
  }

  // Envoyer une alerte de changement de prix
  static async sendPriceChangeAlert(user, product) {
    const subject = `Prix mis à jour pour ${product.name}`;
    
    const html = `
      <h2>Bonjour ${user.firstname},</h2>
      <p>Le prix du produit <strong>${product.name}</strong> a été mis à jour.</p>
      <p>Nouveau prix : ${product.price}€</p>
      <p><a href="${process.env.FRONTEND_URL}/product/${product._id}">Voir le produit</a></p>
    `;

    await sendEmail({
      to: user.email,
      subject,
      html
    });
  }

  // Envoyer la newsletter
  static async sendNewsletter() {
    try {
      const alerts = await Alert.findAll({
        where: { 
          type: 'newsletter',
          is_active: true 
        },
        include: [{
          model: User,
          as: 'user',
          attributes: ['email', 'firstname', 'lastname']
        }]
      });

      // Récupérer les produits en promotion
      const featuredProducts = await Product.find({
        is_on_sale: true
      }).limit(5);

      for (const alert of alerts) {
        const user = alert.user;
        const subject = 'Newsletter - Nos offres du moment';
        
        const html = `
          <h2>Bonjour ${user.firstname},</h2>
          <p>Découvrez nos meilleures offres du moment :</p>
          <div>
            ${featuredProducts.map(p => `
              <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd;">
                <h3>${p.name}</h3>
                <p>Prix : ${p.price}€</p>
                <a href="${process.env.FRONTEND_URL}/product/${p._id}">Voir le produit</a>
              </div>
            `).join('')}
          </div>
        `;

        await sendEmail({
          to: user.email,
          subject,
          html
        });
        await alert.update({ last_sent: new Date() });
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la newsletter:', error);
    }
  }
}

export default AlertService; 