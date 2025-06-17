const Alert = require('../models/postgres_models/Alert');
const StockAlert = require('../models/postgres_models/StockAlert');

async function createAlert(req, res) {
  try {
    const alert = await Alert.create({
      alert_type: req.body.alert_type,
      status: 'active',
      user_id: req.user.userId,
      product_id: req.body.product_id
    });
    res.status(201).json(alert);
  } catch (err) {
    console.error('createAlert', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
}

async function getAlerts(req, res) {
  try {
    const alerts = await Alert.findAll({ where: { user_id: req.user.userId } });
    res.status(200).json(alerts);
  } catch (err) {
    console.error('getAlerts', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
}

async function deleteAlert(req, res) {
  try {
    const id = req.params.id;
    await Alert.destroy({ where: { id, user_id: req.user.userId } });
    res.status(204).send();
  } catch (err) {
    console.error('deleteAlert', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
}

async function createStockAlert(req, res) {
  try {
    const alert = await StockAlert.create({
      productId: req.body.productId,
      threshold: req.body.threshold,
      userId: req.user.userId
    });
    res.status(201).json(alert);
  } catch (err) {
    console.error('createStockAlert', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
}

module.exports = { createAlert, getAlerts, deleteAlert, createStockAlert };
