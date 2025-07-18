import { DataTypes } from 'sequelize';
import sequelize from '../../config/postgres.js';
import Product from './ProductPg.js';

const StockHistory = sequelize.define('StockHistory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'id' // Explicitly set the field name
  },
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'productId' // Explicitly set the field name
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'quantity' // Explicitly set the field name
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'createdAt' // Explicitly set the field name
  }
}, {
  tableName: 'StockHistory',
  timestamps: false,
  underscored: false // Don't convert camelCase to snake_case
});

// On ne définit pas d'association automatique entre les modèles

export default StockHistory;
