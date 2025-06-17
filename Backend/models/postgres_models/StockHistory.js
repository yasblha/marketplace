const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');
const Product = require('./ProductPg');

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

module.exports = StockHistory;
