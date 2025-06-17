const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');
const Product = require('./ProductPg');
const User = require('./UserPg');

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

module.exports = StockAlert;
