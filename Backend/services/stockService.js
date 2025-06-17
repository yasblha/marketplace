const { Op } = require('sequelize');
const StockHistory = require('../models/postgres_models/StockHistory');
const StockAlert = require('../models/postgres_models/StockAlert');
const User = require('../models/postgres_models/UserPg');
const { sendEmail } = require('./mailer');

async function recordStock(productId, quantity) {
  await StockHistory.create({ productId, quantity });

  const alerts = await StockAlert.findAll({
    where: {
      productId,
      threshold: { [Op.gte]: quantity }
    },
    include: [User]
  });

  for (const alert of alerts) {
    await sendEmail(alert.User.email, 'Alerte de stock', `Le stock du produit ${productId} est à ${quantity}.`);
  }
}

module.exports = { recordStock };
