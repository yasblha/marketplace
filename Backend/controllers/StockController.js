import StockHistory from '../models/postgres_models/StockHistory.js';

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
    const entry = await StockHistory.create({ productId, quantity });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout d\'une entrée de stock', details: error.message });
  }
} 