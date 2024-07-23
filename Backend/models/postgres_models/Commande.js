const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');
//const User = require('../mongo_models/User');
const User = require('../postgres_models/UserPg');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    date_order: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    status_order: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    total_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    product_ids: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
    },
});

Order.belongsTo(User, { foreignKey: 'userId' });

module.exports = Order;
