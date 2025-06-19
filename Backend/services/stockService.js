import { Op } from 'sequelize';
import StockHistory from '../models/postgres_models/StockHistory.js';
import StockAlert from '../models/postgres_models/StockAlert.js';
import User from '../models/postgres_models/UserPg.js';
import { sendEmail } from './mailer.js';

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

export { recordStock };
