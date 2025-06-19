import User from '../models/postgres_models/UserPg.js';
import Order from '../models/postgres_models/Commande.js';
import Product from '../models/mongo_models/Product.js';
import ORDER_STATUS from '../constants/orderStatus.js';

class AnalyticsService {
  static async getOverview() {
    const [userCount, productCount, totalOrders] = await Promise.all([
      User.count(),
      Product.countDocuments(),
      Order.count()
    ]);

    // Utiliser les bons noms de colonnes avec la syntaxe Sequelize
    const orders = await Promise.all(
      Object.values(ORDER_STATUS).map(async (status) => ({
        status,
        count: await Order.count({ 
          where: { 
            status_order: status 
          } 
        })
      }))
    );

    // Utiliser le bon nom de colonne pour le calcul du chiffre d'affaires
    const totalRevenue = await Order.sum('total_amount', { 
      where: { 
        status_order: ORDER_STATUS.PAID 
      } 
    }) || 0;

    return { 
      userCount, 
      productCount, 
      totalOrders, 
      orders, 
      totalRevenue,
      // Ajout d'informations supplémentaires utiles pour le tableau de bord
      orderStatus: ORDER_STATUS,
      lastUpdated: new Date().toISOString()
    };
  }
}

export default AnalyticsService;
