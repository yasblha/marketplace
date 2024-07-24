const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');
const User = require('../mongo_models/User');

const DeliveryAddress = sequelize.define('DeliveryAddress', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    postalcode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    department: {
        type: DataTypes.STRING,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

DeliveryAddress.belongsTo(User, { foreignKey: 'userId' });

module.exports = DeliveryAddress;
