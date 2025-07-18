import CartReservationService from './CartReservationService.js';
import OrderService from './CommandeServices.js';
import db from '../models/index.js';
import ProductService from './productService.js';
import { sequelizeInstance } from '../config/sequelizeConfig.js';
import ORDER_STATUS from '../constants/orderStatus.js';
import invoiceService from './invoiceService.js';

const Cart = db.Panier;
const Client = db.UserPg;
const sequelize = sequelizeInstance;

class CheckoutService {
  /**
   * Valider le panier et préparer la commande
   */
  static async validateCart(userId) {
    try {
      // Récupérer les articles du panier avec les produits
      const cartItems = await Cart.findAll({
        where: { userid: userId },
        include: [{ model: Client, as: 'UserPg' }]
      });

      if (cartItems.length === 0) {
        throw new Error('Panier vide');
      }

      // Valider chaque réservation
      const validationResults = await CartReservationService.validateUserReservations(userId);
      
      const validItems = validationResults.filter(item => item.valid);
      const invalidItems = validationResults.filter(item => !item.valid);

      if (invalidItems.length > 0) {
        // Libérer automatiquement les réservations invalides
        for (const invalidItem of invalidItems) {
          try {
            await CartReservationService.releaseReservation(invalidItem.reservationId, userId);
          } catch (error) {
            console.error('Erreur lors de la libération de la réservation invalide:', error);
          }
        }
      }

      if (validItems.length === 0) {
        throw new Error('Aucun article valide dans le panier');
      }

      // Calculer le total
      let totalAmount = 0;
      const products = [];

      for (const item of validItems) {
        const product = await ProductService.getProductById(item.product.productId);
        if (product) {
          const cartItem = cartItems.find(ci => ci.id === item.reservationId);
          const itemTotal = product.price * cartItem.quantity;
          totalAmount += itemTotal;
          
          products.push({
            productId: item.productId,
            quantity: cartItem.quantity,
            unitPrice: product.price,
            totalPrice: itemTotal
          });
        }
      }

      return {
        valid: true,
        totalAmount,
        products,
        validItems,
        invalidItems,
        cartItems: validItems.map(item => {
          const cartItem = cartItems.find(ci => ci.id === item.reservationId);
          return {
            ...cartItem.toJSON(),
            remainingTime: CartReservationService.getRemainingTime(cartItem.reservedUntil),
            formattedRemainingTime: CartReservationService.formatRemainingTime(
              CartReservationService.getRemainingTime(cartItem.reservedUntil)
            )
          };
        })
      };

    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  /**
   * Créer une commande à partir du panier validé
   */
  static async createOrderFromCart(userId, paymentData = {}) {
    const transaction = await sequelize.transaction();
    
    try {
      // Valider le panier
      const validation = await this.validateCart(userId);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Préparer les données de la commande
      const orderProducts = validation.products.map(p => ({
        productId: p.productId,
        quantity: p.quantity
      }));

      // Créer la commande
      const orderId = await OrderService.createOrder(
        userId,
        ORDER_STATUS.PENDING,
        validation.totalAmount,
        orderProducts,
        { transaction }
      );

      // Convertir les réservations en commande
      await CartReservationService.convertReservationsToOrder(userId, orderId);

      await transaction.commit();

      return {
        success: true,
        orderId,
        totalAmount: validation.totalAmount,
        products: validation.products
      };

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Traiter le paiement et finaliser la commande
   */
  static async processPayment(orderId, paymentMethod, paymentData) {
    const transaction = await sequelize.transaction();
    
    try {
      // Récupérer la commande
      const order = await OrderService.getOrderById(orderId);
      if (!order) {
        throw new Error('Commande non trouvée');
      }

      if (order.statusOrder !== ORDER_STATUS.PENDING) {
        throw new Error('Commande déjà traitée');
      }

      // Simuler le traitement du paiement
      // En production, intégrer avec Stripe, PayPal, etc.
      const paymentResult = await this.processPaymentWithProvider(
        paymentMethod, 
        paymentData, 
        order.totalAmount
      );

      if (paymentResult.success) {
        // Mettre à jour le statut de la commande
        await OrderService.updateOrder(orderId, {
          statusOrder: ORDER_STATUS.PAID
        });

        // Générer automatiquement la facture pour la commande payée
        try {
          console.log(`Génération automatique de la facture pour la commande ${orderId}`);
          await invoiceService.generateInvoice(orderId);
          console.log(`Facture générée avec succès pour la commande ${orderId}`);
        } catch (invoiceError) {
          // Log error but don't fail the transaction
          console.error(`Erreur lors de la génération automatique de la facture pour la commande ${orderId}:`, invoiceError);
        }

        await transaction.commit();

        return {
          success: true,
          orderId,
          paymentId: paymentResult.paymentId,
          status: ORDER_STATUS.PAID
        };
      } else {
        throw new Error(paymentResult.error || 'Échec du paiement');
      }

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Simuler le traitement du paiement avec différents fournisseurs
   */
  static async processPaymentWithProvider(paymentMethod, paymentData, amount) {
    // Simulation - en production, intégrer avec de vrais fournisseurs
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simuler un taux de succès de 95%
        const success = Math.random() > 0.05;
        
        if (success) {
          resolve({
            success: true,
            paymentId: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            amount,
            method: paymentMethod
          });
        } else {
          resolve({
            success: false,
            error: 'Paiement refusé par la banque'
          });
        }
      }, 1000); // Simuler un délai de traitement
    });
  }

  /**
   * Annuler une commande et libérer les réservations
   */
  static async cancelOrder(orderId, userId) {
    const transaction = await sequelize.transaction();
    
    try {
      const order = await OrderService.getOrderById(orderId);
      if (!order || order.userId !== userId) {
        throw new Error('Commande non trouvée ou non autorisée');
      }

      if (order.statusOrder === ORDER_STATUS.SHIPPED || order.statusOrder === ORDER_STATUS.DELIVERED) {
        throw new Error('Impossible d\'annuler une commande expédiée');
      }

      // Mettre à jour le statut
      await OrderService.updateOrder(orderId, {
        statusOrder: ORDER_STATUS.CANCELED
      });

      // Restituer le stock si la commande était payée
      if (order.statusOrder === ORDER_STATUS.PAID) {
        const orderDetails = await OrderService.getOrderDetails(orderId);
        for (const detail of orderDetails) {
          await ProductService.incrementStock(detail.productId, detail.quantity);
        }
      }

      await transaction.commit();

      return {
        success: true,
        message: 'Commande annulée avec succès'
      };

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Obtenir le résumé de la commande
   */
  static async getOrderSummary(orderId, userId) {
    try {
      const order = await OrderService.getOrderById(orderId);
      if (!order || order.userId !== userId) {
        throw new Error('Commande non trouvée ou non autorisée');
      }

      const orderDetails = await OrderService.getOrderDetails(orderId);
      
      return {
        orderId: order.id,
        status: order.statusOrder,
        totalAmount: order.totalAmount,
        orderDate: order.dateOrder,
        products: orderDetails.map(detail => ({
          productId: detail.productId,
          productName: detail.productName,
          quantity: detail.quantity,
          unitPrice: detail.unitPrice,
          totalPrice: detail.unitPrice * detail.quantity
        }))
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * Étendre toutes les réservations d'un utilisateur
   */
  static async extendAllReservations(userId, isAuthenticated = false) {
    try {
      const cartItems = await Cart.findAll({
        where: { userid: userId }
      });

      const results = [];

      for (const item of cartItems) {
        try {
          const extended = await CartReservationService.extendReservation(
            item.id, 
            userId, 
            isAuthenticated
          );
          results.push({
            cartItemId: item.id,
            success: true,
            newExpiry: extended.reservedUntil
          });
        } catch (error) {
          results.push({
            cartItemId: item.id,
            success: false,
            error: error.message
          });
        }
      }

      return results;

    } catch (error) {
      throw error;
    }
  }
}

export default CheckoutService; 