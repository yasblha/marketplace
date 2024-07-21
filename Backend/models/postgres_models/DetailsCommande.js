// models/OrderDetail.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');
const Order = require('./Order');
const Product = require('../mongo_models/Product');

const OrderDetail = sequelize.define('OrderDetail', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    unit_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

OrderDetail.belongsTo(Order, { foreignKey: 'order_id' });
OrderDetail.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = OrderDetail;
