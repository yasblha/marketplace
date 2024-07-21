const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');
const Client = require('./UserPg');
const Product = require('./ProductPg');

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Clients',
            key: 'id'
        }
    },
    productid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Product',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
}, {
    tableName: 'Cart',
    timestamps: false,
});

// Définition des associations
Cart.belongsTo(Client, { foreignKey: 'userid' });
Cart.belongsTo(Product, { foreignKey: 'productid' });

module.exports = Cart;