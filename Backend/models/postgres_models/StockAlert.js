import { DataTypes } from 'sequelize';
import sequelize from '../../config/postgres.js';
import Product from './ProductPg.js';
import User from './UserPg.js';

const StockAlert = sequelize.define('StockAlert', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  threshold: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'StockAlert',
  timestamps: false
});

StockAlert.belongsTo(Product, { foreignKey: 'productId' });
StockAlert.belongsTo(User, { foreignKey: 'userId' });

export default StockAlert;
