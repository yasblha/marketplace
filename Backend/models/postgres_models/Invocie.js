const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');
const Order = require('./Order');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  uniref: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  issue_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  net_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  vat_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  gross_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Invoice.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = Invoice;
