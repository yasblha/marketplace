import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Order from '../models/postgres_models/Commande.js';
import invoiceService from '../services/invoiceService.js';
import ORDER_STATUS from '../constants/orderStatus.js';

// Pour résoudre __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Contrôleur de gestion des factures
 */
class InvoiceController {
  /**
   * Génère une facture pour une commande et la renvoie
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async generateInvoice(req, res) {
    try {
      const { orderId } = req.params;
      const userId = req.user.userId;

      // Vérifier que l'utilisateur a accès à cette commande
      const order = await Order.findByPk(orderId);
      
      if (!order) {
        return res.status(404).json({ message: 'Commande introuvable' });
      }

      // Vérifier que l'utilisateur est bien le propriétaire de la commande ou un admin
      if (order.userId !== userId && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Accès non autorisé à cette commande' });
      }

      // Générer la facture
      const pdfPath = await invoiceService.generateInvoice(orderId, false);
      
      // Envoyer le fichier PDF
      res.sendFile(pdfPath);
    } catch (error) {
      console.error('Error in generateInvoice:', error);
      res.status(500).json({ message: 'Erreur lors de la génération de la facture', error: error.message });
    }
  }

  /**
   * Envoie la facture par email
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async sendInvoiceByEmail(req, res) {
    try {
      const { orderId } = req.params;
      const userId = req.user.userId;

      // Vérifier que l'utilisateur a accès à cette commande
      const order = await Order.findByPk(orderId);
      
      if (!order) {
        return res.status(404).json({ message: 'Commande introuvable' });
      }

      // Vérifier que l'utilisateur est bien le propriétaire de la commande ou un admin
      if (order.userId !== userId && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Accès non autorisé à cette commande' });
      }

      // Générer la facture et l'envoyer par email
      await invoiceService.generateInvoice(orderId, true);
      
      res.status(200).json({ message: 'Facture envoyée par email avec succès' });
    } catch (error) {
      console.error('Error in sendInvoiceByEmail:', error);
      res.status(500).json({ message: 'Erreur lors de l\'envoi de la facture par email', error: error.message });
    }
  }

  /**
   * Liste toutes les factures d'un utilisateur
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getUserInvoices(req, res) {
    try {
      console.log('Demande de factures utilisateur:', req.user);
      
      // Vérifier si l'utilisateur est correctement authentifié
      if (!req.user || !req.user.userId) {
        console.error('Erreur: Utilisateur non authentifié ou userId manquant');
        return res.status(401).json({ message: 'Utilisateur non authentifié ou identifiant manquant' });
      }
      
      const userId = req.user.userId;
      console.log('Recherche des factures pour l\'utilisateur:', userId);

      // Récupérer toutes les commandes de l'utilisateur
      const orders = await Order.findAll({
        where: { 
          userId,
          statusOrder: [ORDER_STATUS.DELIVERED, ORDER_STATUS.PAID] // Ne prendre que les commandes terminées
        },
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'createdAt', 'totalAmount', 'statusOrder']
      });
      
      console.log(`${orders.length} commandes trouvées pour l'utilisateur ${userId}`);
      
      const invoicesDir = path.join(__dirname, '../invoices');
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
      }
      
      // Pour chaque commande, générer la facture si elle n'existe pas
      const invoices = await Promise.all(orders.map(async order => {
        const invoiceFile = path.join(invoicesDir, `invoice-${order.id}.pdf`);
        let invoiceExists = fs.existsSync(invoiceFile);
        
        // Si la facture n'existe pas et que la commande est payée, la générer automatiquement
        if (!invoiceExists && order.statusOrder === ORDER_STATUS.PAID) {
          try {
            console.log(`Génération automatique de la facture pour la commande ${order.id}`);
            await invoiceService.generateInvoice(order.id, false);
            invoiceExists = fs.existsSync(invoiceFile); // Vérifier à nouveau après la génération
            console.log(`Facture générée avec succès pour la commande ${order.id}`);
          } catch (err) {
            console.error(`Erreur lors de la génération de la facture pour la commande ${order.id}:`, err);
            // On continue malgré l'erreur pour renvoyer les autres factures
          }
        }
        
        return {
          orderId: order.id,
          orderDate: order.createdAt,
          amount: order.totalAmount,
          status: order.statusOrder,
          paymentStatus: order.paymentStatus,
          invoiceExists: invoiceExists
        };
      }));
      
      res.status(200).json(invoices);
    } catch (error) {
      console.error('Error in getUserInvoices:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des factures', error: error.message });
    }
  }

  /**
   * Liste toutes les factures (admin)
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getAllInvoices(req, res) {
    try {
      // Récupérer toutes les commandes avec pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;
      
      const { count, rows: orders } = await Order.findAndCountAll({
        where: { 
          statusOrder: ['completed', 'delivered']
        },
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        attributes: ['id', 'userId', 'createdAt', 'totalAmount', 'statusOrder', 'paymentStatus']
      });
      
      const invoicesDir = path.join(__dirname, '../invoices');
      
      // Pour chaque commande, vérifier si la facture existe déjà
      const invoices = await Promise.all(orders.map(async order => {
        const invoiceFile = path.join(invoicesDir, `invoice-${order.id}.pdf`);
        const invoiceExists = fs.existsSync(invoiceFile);
        
        return {
          orderId: order.id,
          userId: order.userId,
          orderDate: order.createdAt,
          amount: order.totalAmount,
          status: order.statusOrder,
          paymentStatus: order.paymentStatus,
          invoiceExists: invoiceExists
        };
      }));
      
      res.status(200).json({
        invoices,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalItems: count
      });
    } catch (error) {
      console.error('Error in getAllInvoices:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des factures', error: error.message });
    }
  }

  /**
   * Génère automatiquement les factures pour les commandes qui n'en ont pas
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async generateMissingInvoices(req, res) {
    try {
      // Récupérer toutes les commandes terminées
      const orders = await Order.findAll({
        where: { 
          statusOrder: [ORDER_STATUS.DELIVERED, ORDER_STATUS.PAID]
        },
        attributes: ['id']
      });
      
      const invoicesDir = path.join(__dirname, '../invoices');
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
      }
      
      // Compteurs pour la réponse
      const results = {
        total: orders.length,
        generated: 0,
        failed: 0,
        skipped: 0
      };
      
      // Pour chaque commande, vérifier si la facture existe déjà
      for (const order of orders) {
        const invoiceFile = path.join(invoicesDir, `invoice-${order.id}.pdf`);
        
        if (!fs.existsSync(invoiceFile)) {
          try {
            await invoiceService.generateInvoice(order.id, false);
            results.generated++;
          } catch (err) {
            console.error(`Failed to generate invoice for order ${order.id}:`, err);
            results.failed++;
          }
        } else {
          results.skipped++;
        }
      }
      
      res.status(200).json({
        message: 'Génération des factures manquantes terminée',
        results
      });
    } catch (error) {
      console.error('Error in generateMissingInvoices:', error);
      res.status(500).json({ message: 'Erreur lors de la génération des factures manquantes', error: error.message });
    }
  }

  /**
   * Prévisualise une facture pour une commande
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async previewInvoice(req, res) {
    try {
      const { orderId } = req.params;
      const userId = req.user.userId;

      // Vérifier que l'utilisateur a accès à cette commande
      const order = await Order.findByPk(orderId);
      
      if (!order) {
        return res.status(404).json({ message: 'Commande introuvable' });
      }

      // Vérifier que l'utilisateur est bien le propriétaire de la commande ou un admin
      if (order.userId !== userId && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Accès non autorisé à cette commande' });
      }

      // Chemin du fichier PDF
      const invoicesDir = path.join(__dirname, '../invoices');
      const pdfPath = path.join(invoicesDir, `invoice-${orderId}.pdf`);
      
      // Vérifier si le fichier existe
      if (!fs.existsSync(pdfPath)) {
        // Générer la facture si elle n'existe pas
        await invoiceService.generateInvoice(orderId, false);
        
        // Vérifier à nouveau que le fichier a été créé
        if (!fs.existsSync(pdfPath)) {
          return res.status(404).json({ message: 'Facture introuvable et impossible à générer' });
        }
      }
      
      // Configuration pour l'affichage dans le navigateur
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="facture.pdf"');
      
      // Stream le fichier PDF
      const fileStream = fs.createReadStream(pdfPath);
      fileStream.pipe(res);
    } catch (error) {
      console.error('Error in previewInvoice:', error);
      res.status(500).json({ message: 'Erreur lors de la prévisualisation de la facture', error: error.message });
    }
  }

  /**
   * Télécharge une facture pour une commande
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async downloadInvoice(req, res) {
    try {
      const { orderId } = req.params;
      const userId = req.user.userId;

      // Vérifier que l'utilisateur a accès à cette commande
      const order = await Order.findByPk(orderId);
      
      if (!order) {
        return res.status(404).json({ message: 'Commande introuvable' });
      }

      // Vérifier que l'utilisateur est bien le propriétaire de la commande ou un admin
      if (order.userId !== userId && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Accès non autorisé à cette commande' });
      }

      // Chemin du fichier PDF
      const invoicesDir = path.join(__dirname, '../invoices');
      const pdfPath = path.join(invoicesDir, `invoice-${orderId}.pdf`);
      
      // Vérifier si le fichier existe
      if (!fs.existsSync(pdfPath)) {
        // Générer la facture si elle n'existe pas
        await invoiceService.generateInvoice(orderId, false);
        
        // Vérifier à nouveau que le fichier a été créé
        if (!fs.existsSync(pdfPath)) {
          return res.status(404).json({ message: 'Facture introuvable et impossible à générer' });
        }
      }
      
      // Configuration pour le téléchargement
      const fileName = `facture-${orderId}.pdf`;
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Type', 'application/pdf');
      
      // Envoyer le fichier pour téléchargement
      res.download(pdfPath, fileName);
    } catch (error) {
      console.error('Error in downloadInvoice:', error);
      res.status(500).json({ message: 'Erreur lors du téléchargement de la facture', error: error.message });
    }
  }
}

export default new InvoiceController();
