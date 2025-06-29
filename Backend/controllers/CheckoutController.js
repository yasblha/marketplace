import CheckoutService from '../services/CheckoutService.js';
import CartReservationService from '../services/CartReservationService.js';
import authenticateToken from '../middleware/tockenJWT.js';

/**
 * Valider le panier avant checkout
 */
export async function validateCart(req, res) {
  try {
    const { userId } = req.params;
    
    // Vérifier que l'utilisateur est authentifié
    if (req.user && req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    const validation = await CheckoutService.validateCart(userId);
    
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.error,
        data: validation
      });
    }

    res.status(200).json({
      success: true,
      data: validation
    });

  } catch (error) {
    console.error('Erreur lors de la validation du panier:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
}

/**
 * Créer une commande à partir du panier
 */
export async function createOrder(req, res) {
  try {
    const { userId } = req.params;
    const { paymentData } = req.body;
    
    // Vérifier que l'utilisateur est authentifié
    if (req.user && req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    const result = await CheckoutService.createOrderFromCart(userId, paymentData);

    res.status(201).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
}

/**
 * Traiter le paiement
 */
export async function processPayment(req, res) {
  try {
    const { orderId } = req.params;
    const { paymentMethod, paymentData } = req.body;
    
    // Vérifier que l'utilisateur est authentifié
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }

    const result = await CheckoutService.processPayment(orderId, paymentMethod, paymentData);

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Erreur lors du traitement du paiement:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
}

/**
 * Obtenir le résumé d'une commande
 */
export async function getOrderSummary(req, res) {
  try {
    const { orderId } = req.params;
    
    // Vérifier que l'utilisateur est authentifié
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }

    const summary = await CheckoutService.getOrderSummary(orderId, req.user.id);

    res.status(200).json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du résumé:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
}

/**
 * Annuler une commande
 */
export async function cancelOrder(req, res) {
  try {
    const { orderId } = req.params;
    
    // Vérifier que l'utilisateur est authentifié
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }

    const result = await CheckoutService.cancelOrder(orderId, req.user.id);

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Erreur lors de l\'annulation de la commande:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
}

/**
 * Étendre toutes les réservations d'un utilisateur
 */
export async function extendReservations(req, res) {
  try {
    const { userId } = req.params;
    
    // Vérifier que l'utilisateur est authentifié
    if (req.user && req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    const isAuthenticated = !!req.user;
    const results = await CheckoutService.extendAllReservations(userId, isAuthenticated);

    res.status(200).json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Erreur lors de l\'extension des réservations:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
}

/**
 * Libérer une réservation spécifique
 */
export async function releaseReservation(req, res) {
  try {
    const { cartItemId } = req.params;
    const { userId } = req.body;
    
    // Vérifier que l'utilisateur est authentifié
    if (req.user && req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    const result = await CartReservationService.releaseReservation(cartItemId, userId);

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Erreur lors de la libération de la réservation:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
}

/**
 * Obtenir le statut des réservations
 */
export async function getReservationStatus(req, res) {
  try {
    const { userId } = req.params;
    
    // Vérifier que l'utilisateur est authentifié
    if (req.user && req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    const validation = await CheckoutService.validateCart(userId);
    
    const status = {
      totalItems: validation.valid ? validation.cartItems.length : 0,
      validItems: validation.valid ? validation.validItems.length : 0,
      invalidItems: validation.valid ? validation.invalidItems.length : 0,
      totalAmount: validation.valid ? validation.totalAmount : 0,
      hasExpiredItems: validation.valid ? validation.invalidItems.some(item => item.reason === 'Réservation expirée') : false,
      canCheckout: validation.valid && validation.validItems.length > 0
    };

    res.status(200).json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du statut:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
} 