const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');
const Client = require('./UserPg');
const Product = require('./ProductPg');

const Favorite = sequelize.define('Favorite', {
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
            model: 'Products',
            key: 'id'
        }
    }
}, {
    tableName: 'Favorite',
    timestamps: false,
});

Favorite.belongsTo(Client, { foreignKey: 'userid' });
Favorite.belongsTo(Product, { foreignKey: 'productid' });

module.exports = Favorite;
