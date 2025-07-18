import { Op } from 'sequelize';
import StockHistory from '../models/postgres_models/StockHistory.js';
import { fileURLToPath } from 'url';
import Product from '../models/postgres_models/ProductPg.js';
import path from 'path';

// Pour résoudre __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Contrôleur pour la gestion de l'historique des stocks
 */
class StockHistoryController {
  /**
   * Récupère l'évolution du stock pour un ou plusieurs produits
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getStockEvolution(req, res) {
    try {
      const { 
        days = 30, 
        startDate, 
        endDate, 
        productId, 
        categoryId, 
        changeType,
        hideIncrease,
        hideDecrease
      } = req.query;
      
      // Calculer la période de temps
      const calculatedEndDate = endDate ? new Date(endDate) : new Date();
      let calculatedStartDate;
      
      if (startDate) {
        calculatedStartDate = new Date(startDate);
      } else {
        calculatedStartDate = new Date();
        calculatedStartDate.setDate(calculatedStartDate.getDate() - parseInt(days));
      }
      
      // Construire la clause where
      const whereClause = {
        createdAt: {
          [Op.between]: [calculatedStartDate, calculatedEndDate]
        }
      };
      
      // Filtrer par produit spécifique
      if (productId) {
        whereClause.productId = productId;
      }
      
      // Filtrer par type de changement
      if (hideIncrease || hideDecrease) {
        if (hideIncrease && !hideDecrease) {
          whereClause.quantity = { [Op.lt]: 0 };
        } else if (hideDecrease && !hideIncrease) {
          whereClause.quantity = { [Op.gt]: 0 };
        }
      } else if (changeType) {
        if (changeType === 'increase') {
          whereClause.quantity = { [Op.gt]: 0 };
        } else if (changeType === 'decrease') {
          whereClause.quantity = { [Op.lt]: 0 };
        }
      }
      
      console.log('Querying stock history with filter:', whereClause);
      
      // Récupérer l'historique des stocks sans inclure les produits directement
      const stockHistory = await StockHistory.findAll({
        where: whereClause,
        order: [['createdAt', 'ASC']]
      });
      
      console.log(`Found ${stockHistory.length} stock history records`);
      
      // Récupérer tous les IDs de produits uniques
      const productIds = [...new Set(stockHistory.map(entry => entry.productId))];
      console.log('Product IDs found:', productIds);
      
      // Récupérer les produits séparément
      const products = await Product.findAll({
        where: {
          id: { [Op.in]: productIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id)) }
        }
      });
      
      console.log(`Found ${products.length} products`);
      
      // Créer un dictionnaire pour un accès rapide aux produits
      const productMap = {};
      products.forEach(product => {
        productMap[product.id] = product;
      });
      
      // Associer manuellement les produits à l'historique
      const stockHistoryWithProducts = stockHistory.map(entry => {
        const rawData = entry.toJSON();
        
        // Essayer de convertir l'ID en entier
        const numericId = parseInt(entry.productId, 10);
        
        // Associer le produit si disponible
        if (!isNaN(numericId) && productMap[numericId]) {
          rawData.product = productMap[numericId];
          rawData.productName = productMap[numericId].name; // Ajout explicite du nom
        } else {
          rawData.product = null;
          rawData.productName = `Produit #${entry.productId}`; // Nom par défaut
        }
        
        return rawData;
      });
      
      // Filtrer les entrées où product est null (si le produit a été supprimé ou invalide)
      const validStockHistory = stockHistoryWithProducts.filter(entry => entry.product !== null);
      console.log(`${validStockHistory.length} valid entries with products`);
      
      // Formater les données pour le graphique
      const formattedData = this.formatDataForChart(validStockHistory, calculatedStartDate, calculatedEndDate);
      console.log('Formatted data structure:', JSON.stringify({
        labelsCount: formattedData.labels.length,
        datasetsCount: formattedData.datasets.length,
        sampleLabels: formattedData.labels.slice(0, 3),
        sampleDataset: formattedData.datasets.length > 0 ? {
          label: formattedData.datasets[0].label,
          dataLength: formattedData.datasets[0].data.length,
          sampleData: formattedData.datasets[0].data.slice(0, 3)
        } : 'No datasets'
      }));
      
      res.status(200).json(formattedData);
    } catch (error) {
      console.error('Error in getStockEvolution:', error);
      res.status(500).json({
        message: 'Erreur lors de la récupération des données d\'évolution de stock',
        error: error.message
      });
    }
  }

  /**
   * Récupère les alertes de stock bas
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getLowStockAlerts(req, res) {
    try {
      const { threshold = 5 } = req.query;
      
      // Récupérer les produits avec un stock bas
      const lowStockProducts = await Product.findAll({
        where: {
          stock: { [Op.lte]: parseInt(threshold) },
          active: true
        },
        attributes: ['id', 'name', 'stock', 'price', 'categoryId'],
        order: [['stock', 'ASC']]
      });
      
      // Ajouter l'historique récent pour chaque produit
      const productsWithHistory = await Promise.all(lowStockProducts.map(async (product) => {
        // Récupérer l'historique des 10 derniers jours
        const history = await StockHistory.findAll({
          where: {
            productId: product.id,
            createdAt: {
              [Op.gte]: new Date(new Date().getTime() - (10 * 24 * 60 * 60 * 1000))
            }
          },
          order: [['createdAt', 'ASC']]
        });
        
        return {
          ...product.toJSON(),
          recentHistory: history
        };
      }));
      
      res.status(200).json(productsWithHistory);
    } catch (error) {
      console.error('Error in getLowStockAlerts:', error);
      res.status(500).json({
        message: 'Erreur lors de la récupération des alertes de stock bas',
        error: error.message
      });
    }
  }

  /**
   * Exporte les données de stock bas au format CSV
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async exportLowStockCsv(req, res) {
    try {
      const { threshold = 5 } = req.query;
      
      // Récupérer les produits avec un stock bas
      const lowStockProducts = await Product.findAll({
        where: {
          stock: { [Op.lte]: parseInt(threshold) },
          active: true
        },
        attributes: ['id', 'name', 'stock', 'price', 'categoryId'],
        order: [['stock', 'ASC']]
      });
      
      // Générer le contenu CSV
      let csvContent = 'ID,Nom,Stock Actuel,Prix,ID Catégorie\n';
      
      lowStockProducts.forEach(product => {
        csvContent += `${product.id},${product.name.replace(/,/g, ' ')},${product.stock},${product.price},${product.categoryId}\n`;
      });
      
      // Configurer les en-têtes pour le téléchargement
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=stock_bas_${new Date().toISOString().split('T')[0]}.csv`);
      
      res.status(200).send(csvContent);
    } catch (error) {
      console.error('Error in exportLowStockCsv:', error);
      res.status(500).json({
        message: 'Erreur lors de l\'export CSV des stocks bas',
        error: error.message
      });
    }
  }

  /**
   * Formate les données pour le graphique
   * @param {Array} stockHistory - Historique de stock brut
   * @param {Date} startDate - Date de début
   * @param {Date} endDate - Date de fin
   * @returns {Object} - Données formatées pour le graphique
   * @private
   */
  formatDataForChart(stockHistory, startDate, endDate) {
    // Si l'historique est vide, retourner un objet avec des tableaux vides
    if (stockHistory.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }
    
    // Regrouper par produit
    const productGroups = stockHistory.reduce((groups, item) => {
      const key = item.productId;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
    
    // Formater les étiquettes de date (jours)
    const days = this.getDaysBetweenDates(startDate, endDate);
    const labels = days.map(date => date.toISOString().split('T')[0]);
    
    // Préparer les datasets pour chaque produit
    const datasets = Object.entries(productGroups).map(([productId, items], index) => {
      const productName = items[0].product.name;
      
      // Calculer le stock cumulatif au fil du temps
      const stockByDay = {};
      let cumulativeStock = 0;
      
      // Initialiser toutes les dates à null
      days.forEach(date => {
        stockByDay[date.toISOString().split('T')[0]] = null;
      });
      
      // Remplir avec les données réelles
      items.forEach(item => {
        const dateStr = new Date(item.createdAt).toISOString().split('T')[0];
        cumulativeStock += item.quantity;
        stockByDay[dateStr] = cumulativeStock;
      });
      
      // Remplacer les valeurs null par la dernière valeur connue
      let lastKnownValue = 0;
      for (const day of Object.keys(stockByDay).sort()) {
        if (stockByDay[day] === null) {
          stockByDay[day] = lastKnownValue;
        } else {
          lastKnownValue = stockByDay[day];
        }
      }
      
      // Générer une couleur unique pour chaque produit
      const hue = (index * 137) % 360;
      const color = `hsla(${hue}, 70%, 60%, 0.7)`;
      const borderColor = `hsla(${hue}, 70%, 50%, 1)`;
      
      return {
        label: productName,
        data: labels.map(label => stockByDay[label] || 0),
        backgroundColor: color,
        borderColor: borderColor,
        borderWidth: 2,
        tension: 0.4,
        productId: productId
      };
    });
    
    return {
      labels,
      datasets
    };
  }

  /**
   * Génère un tableau de dates entre deux dates
   * @param {Date} startDate - Date de début
   * @param {Date} endDate - Date de fin
   * @returns {Array} - Tableau de dates
   * @private
   */
  getDaysBetweenDates(startDate, endDate) {
    const days = [];
    let currentDate = new Date(startDate);
    
    // Normaliser les dates pour éviter les problèmes d'heure
    currentDate.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    while (currentDate <= end) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  }
}

export default new StockHistoryController();
