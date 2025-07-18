import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Sequelize } from 'sequelize';
import Order from '../models/postgres_models/Commande.js';
import invoiceService from '../services/invoiceService.js';
import ORDER_STATUS from '../constants/orderStatus.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script pour générer toutes les factures manquantes pour les commandes payées
 */
async function generateMissingInvoices() {
  try {
    console.log('Démarrage de la génération des factures manquantes...');

    // S'assurer que le dossier invoices existe
    const invoicesDir = path.join(__dirname, '../invoices');
    if (!fs.existsSync(invoicesDir)) {
      console.log(`Création du dossier ${invoicesDir}...`);
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    // Récupérer toutes les commandes payées
    const orders = await Order.findAll({
      where: {
        statusOrder: ORDER_STATUS.PAID
      }
    });

    console.log(`${orders.length} commandes payées trouvées.`);
    
    // Pour chaque commande, vérifier si la facture existe déjà
    let generated = 0;
    let skipped = 0;
    let failed = 0;

    for (const order of orders) {
      const invoiceFile = path.join(invoicesDir, `invoice-${order.id}.pdf`);
      const invoiceExists = fs.existsSync(invoiceFile);
      
      if (!invoiceExists) {
        try {
          console.log(`Génération de la facture pour la commande ${order.id}...`);
          await invoiceService.generateInvoice(order.id, false);
          generated++;
          console.log(`Facture générée avec succès pour la commande ${order.id}`);
        } catch (error) {
          console.error(`Erreur lors de la génération de la facture pour la commande ${order.id}:`, error);
          failed++;
        }
      } else {
        console.log(`La facture pour la commande ${order.id} existe déjà.`);
        skipped++;
      }
    }

    console.log('Génération des factures manquantes terminée.');
    console.log(`Résumé: ${generated} factures générées, ${skipped} déjà existantes, ${failed} échecs.`);
  } catch (error) {
    console.error('Erreur lors de la génération des factures:', error);
  } finally {
    // Terminer le processus
    process.exit(0);
  }
}

// Exécuter le script
generateMissingInvoices();
