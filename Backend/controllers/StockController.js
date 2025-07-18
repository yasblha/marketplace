import StockHistory from '../models/postgres_models/StockHistory.js';
import ProductPg from '../models/postgres_models/ProductPg.js';
import Product from '../models/mongo_models/Product.js';

export async function getStockHistory(req, res) {
  const { productId } = req.params;
  try {
    const history = await StockHistory.findAll({
      where: { productId },
      order: [['createdAt', 'DESC']]
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique de stock', details: error.message });
  }
}

export async function addStockEntry(req, res) {
  const { productId } = req.params;
  const { quantity } = req.body; // positif = entrée, négatif = sortie
  
  try {
    // 1. Ajouter l'entrée d'historique
    const entry = await StockHistory.create({ productId, quantity });
    
    // 2. Mise à jour du stock dans MongoDB (produit principal)
    const mongoProduct = await Product.findById(productId);
    if (mongoProduct) {
      const currentStock = mongoProduct.stock_available || 0;
      mongoProduct.stock_available = currentStock + parseInt(quantity);
      await mongoProduct.save();
    }
    
    // 3. Mise à jour du produit dans PostgreSQL (si existant)
    const pgProduct = await ProductPg.findOne({ where: { id: productId } });
    if (pgProduct) {
      const currentStock = pgProduct.stock_available || 0;
      pgProduct.stock_available = currentStock + parseInt(quantity);
      await pgProduct.save();
    }
    
    res.status(201).json({ 
      entry,
      message: 'Stock mis à jour avec succès',
      updatedStock: mongoProduct ? mongoProduct.stock_available : null
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'une entrée de stock:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout d\'une entrée de stock', details: error.message });
  }
}