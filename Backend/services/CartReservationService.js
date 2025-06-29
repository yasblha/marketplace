import db from '../models/index.js';
import { sequelizeInstance } from '../config/sequelizeConfig.js';
import { Op } from 'sequelize';

const Cart = db.Panier;
const Product = db.ProductPg;
const sequelize = sequelizeInstance;

class CartReservationService {
  // Durée de réservation par défaut (15 minutes)
  static RESERVATION_DURATION = 15 * 60 * 1000; // 15 minutes en millisecondes
  
  // Durée d'extension pour les utilisateurs connectés (30 minutes)
  static EXTENDED_RESERVATION_DURATION = 30 * 60 * 1000; // 30 minutes

  /**
   * Créer une réservation pour un produit dans le panier
   */
  static async createReservation(userId, productId, quantity, isAuthenticated = false) {
    const transaction = await sequelize.transaction();
    
    try {
      // Vérifier si l'utilisateur a déjà une réservation pour ce produit
      const existingReservation = await Cart.findOne({
        where: { 
          userid: userId, 
          productid: productId 
        },
        transaction
      });

      if (existingReservation) {
        // Étendre la réservation existante
        const newQuantity = existingReservation.quantity + quantity;
        const duration = isAuthenticated ? this.EXTENDED_RESERVATION_DURATION : this.RESERVATION_DURATION;
        const newReservedUntil = new Date(Date.now() + duration);

        await existingReservation.update({
          quantity: newQuantity,
          reservedUntil: newReservedUntil
        }, { transaction });

        // Planifier la libération du stock
        this.scheduleStockRelease(existingReservation.id, newReservedUntil);

        await transaction.commit();
        return existingReservation;
      }

      // Vérifier le stock disponible
      const product = await Product.findByPk(productId, { transaction });
      if (!product) {
        throw new Error('Produit non trouvé');
      }

      if (product.stock_available < quantity) {
        throw new Error(`Stock insuffisant. Disponible: ${product.stock_available}`);
      }

      // Réserver le stock
      await Product.update(
        { stock_available: sequelize.literal(`stock_available - ${quantity}`) },
        { 
          where: { 
            id: productId, 
            stock_available: { [Op.gte]: quantity } 
          }, 
          transaction 
        }
      );

      // Créer la réservation
      const duration = isAuthenticated ? this.EXTENDED_RESERVATION_DURATION : this.RESERVATION_DURATION;
      const reservedUntil = new Date(Date.now() + duration);

      const reservation = await Cart.create({
        userid: userId,
        productid: productId,
        quantity,
        reservedUntil
      }, { transaction });

      // Planifier la libération du stock
      this.scheduleStockRelease(reservation.id, reservedUntil);

      await transaction.commit();
      return reservation;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Étendre une réservation existante
   */
  static async extendReservation(cartItemId, userId, isAuthenticated = false) {
    const transaction = await sequelize.transaction();
    
    try {
      const reservation = await Cart.findOne({
        where: { id: cartItemId, userid: userId },
        transaction
      });

      if (!reservation) {
        throw new Error('Réservation non trouvée');
      }

      // Vérifier si la réservation n'est pas déjà expirée
      if (new Date() > reservation.reservedUntil) {
        throw new Error('Réservation expirée');
      }

      const duration = isAuthenticated ? this.EXTENDED_RESERVATION_DURATION : this.RESERVATION_DURATION;
      const newReservedUntil = new Date(Date.now() + duration);

      await reservation.update({
        reservedUntil: newReservedUntil
      }, { transaction });

      // Planifier la nouvelle libération du stock
      this.scheduleStockRelease(reservation.id, newReservedUntil);

      await transaction.commit();
      return reservation;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Libérer une réservation (supprimer du panier)
   */
  static async releaseReservation(cartItemId, userId) {
    const transaction = await sequelize.transaction();
    
    try {
      const reservation = await Cart.findOne({
        where: { id: cartItemId, userid: userId },
        transaction
      });

      if (!reservation) {
        throw new Error('Réservation non trouvée');
      }

      // Restituer le stock
      await Product.increment('stock_available', {
        by: reservation.quantity,
        where: { id: reservation.productid },
        transaction
      });

      // Supprimer la réservation
      await reservation.destroy({ transaction });

      await transaction.commit();
      return { success: true, message: 'Réservation libérée' };

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Valider toutes les réservations d'un utilisateur (avant paiement)
   */
  static async validateUserReservations(userId) {
    const transaction = await sequelize.transaction();
    
    try {
      const reservations = await Cart.findAll({
        where: { userid: userId },
        include: [{ model: Product, as: 'ProductPg' }],
        transaction
      });

      const validationResults = [];

      for (const reservation of reservations) {
        // Vérifier si la réservation n'est pas expirée
        if (new Date() > reservation.reservedUntil) {
          validationResults.push({
            reservationId: reservation.id,
            productId: reservation.productid,
            valid: false,
            reason: 'Réservation expirée'
          });
          continue;
        }

        // Vérifier si le produit existe toujours
        if (!reservation.ProductPg) {
          validationResults.push({
            reservationId: reservation.id,
            productId: reservation.productid,
            valid: false,
            reason: 'Produit non trouvé'
          });
          continue;
        }

        // Vérifier si le stock est toujours suffisant
        if (reservation.ProductPg.stock_available < reservation.quantity) {
          validationResults.push({
            reservationId: reservation.id,
            productId: reservation.productid,
            valid: false,
            reason: 'Stock insuffisant'
          });
          continue;
        }

        validationResults.push({
          reservationId: reservation.id,
          productId: reservation.productid,
          valid: true,
          product: reservation.ProductPg
        });
      }

      await transaction.commit();
      return validationResults;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Convertir les réservations en commande (après paiement réussi)
   */
  static async convertReservationsToOrder(userId, orderId) {
    const transaction = await sequelize.transaction();
    
    try {
      const reservations = await Cart.findAll({
        where: { userid: userId },
        transaction
      });

      if (reservations.length === 0) {
        throw new Error('Aucune réservation trouvée');
      }

      // Supprimer toutes les réservations (le stock est déjà déduit)
      await Cart.destroy({
        where: { userid: userId },
        transaction
      });

      await transaction.commit();
      return { success: true, message: 'Réservations converties en commande' };

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Planifier la libération automatique du stock
   */
  static scheduleStockRelease(reservationId, reservedUntil) {
    const timeUntilExpiry = reservedUntil.getTime() - Date.now();
    
    if (timeUntilExpiry > 0) {
      setTimeout(async () => {
        try {
          await this.releaseExpiredReservation(reservationId);
        } catch (error) {
          console.error('Erreur lors de la libération automatique du stock:', error);
        }
      }, timeUntilExpiry);
    }
  }

  /**
   * Libérer une réservation expirée
   */
  static async releaseExpiredReservation(reservationId) {
    const transaction = await sequelize.transaction();
    
    try {
      const reservation = await Cart.findByPk(reservationId, { transaction });
      
      if (!reservation) {
        await transaction.commit();
        return; // Réservation déjà supprimée
      }

      // Vérifier si la réservation est vraiment expirée
      if (new Date() <= reservation.reservedUntil) {
        await transaction.commit();
        return; // Réservation encore valide
      }

      // Restituer le stock
      await Product.increment('stock_available', {
        by: reservation.quantity,
        where: { id: reservation.productid },
        transaction
      });

      // Supprimer la réservation expirée
      await reservation.destroy({ transaction });

      await transaction.commit();
      console.log(`Réservation ${reservationId} expirée et libérée automatiquement`);

    } catch (error) {
      await transaction.rollback();
      console.error('Erreur lors de la libération de la réservation expirée:', error);
    }
  }

  /**
   * Nettoyer toutes les réservations expirées
   */
  static async cleanupExpiredReservations() {
    const transaction = await sequelize.transaction();
    
    try {
      const expiredReservations = await Cart.findAll({
        where: {
          reservedUntil: { [Op.lt]: new Date() }
        },
        transaction
      });

      for (const reservation of expiredReservations) {
        // Restituer le stock
        await Product.increment('stock_available', {
          by: reservation.quantity,
          where: { id: reservation.productid },
          transaction
        });
      }

      // Supprimer toutes les réservations expirées
      const deletedCount = await Cart.destroy({
        where: {
          reservedUntil: { [Op.lt]: new Date() }
        },
        transaction
      });

      await transaction.commit();
      console.log(`${deletedCount} réservations expirées nettoyées`);
      return deletedCount;

    } catch (error) {
      await transaction.rollback();
      console.error('Erreur lors du nettoyage des réservations expirées:', error);
      throw error;
    }
  }

  /**
   * Obtenir le temps restant d'une réservation
   */
  static getRemainingTime(reservedUntil) {
    const now = new Date();
    const expiry = new Date(reservedUntil);
    const remaining = expiry.getTime() - now.getTime();
    
    return Math.max(0, remaining);
  }

  /**
   * Formater le temps restant en format lisible
   */
  static formatRemainingTime(remainingMs) {
    const minutes = Math.floor(remainingMs / (1000 * 60));
    const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

export default CartReservationService; 