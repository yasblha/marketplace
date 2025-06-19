import { DataTypes } from 'sequelize';
import sequelize from '../../config/postgres.js';
import Product from './ProductPg.js';

const StockHistory = sequelize.define('StockHistory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  productId: {
    type: DataTypes.INTEGER,
    references: { model: Product, key: 'id' }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'StockHistory',
  timestamps: false
});

StockHistory.belongsTo(Product, { foreignKey: 'productId' });

export default StockHistory;
