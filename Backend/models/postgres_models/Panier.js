const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');
const User = require('../mongo_models/User');
const Product = require('../mongo_models/Product');

const Cart = sequelize.define('Cart', {
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
});

Cart.belongsTo(User, { foreignKey: 'user_id' });
Cart.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = Cart;
