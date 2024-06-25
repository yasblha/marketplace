const { DataTypes } = require('sequelize');
const sequelize = require('../config/postgres');


const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    stock_available: {
        type: DataTypes.NUMBER,
    },
    status: {
        type: DataTypes.STRING,
    },
    image: {
        type: DataTypes.STRING,
        defaultValue: false,
    }
});