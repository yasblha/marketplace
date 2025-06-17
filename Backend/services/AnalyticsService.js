const User = require('../models/postgres_models/UserPg');
const Order = require('../models/postgres_models/Commande');
const Product = require('../models/mongo_models/Product');
const ORDER_STATUS = require('../constants/orderStatus');

class AnalyticsService {
  static async getOverview() {
    const [userCount, productCount, totalOrders] = await Promise.all([
      User.count(),
      Product.countDocuments(),
      Order.count()
    ]);

    const orders = await Promise.all(
      Object.values(ORDER_STATUS).map(async (status) => ({
        status,
        count: await Order.count({ where: { statusOrder: status } })
      }))
    );

    const totalRevenue = await Order.sum('totalAmount', { where: { statusOrder: ORDER_STATUS.PAID } }) || 0;

    return { userCount, productCount, totalOrders, orders, totalRevenue };
  }
}

module.exports = AnalyticsService;
