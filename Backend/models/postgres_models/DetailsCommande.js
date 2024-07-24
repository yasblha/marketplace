// models/OrderDetail.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');
const Order = require('./../postgres_models/Commande');
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
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

OrderDetail.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = OrderDetail;
