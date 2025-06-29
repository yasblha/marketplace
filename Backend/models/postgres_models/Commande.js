import { DataTypes } from 'sequelize';
import sequelize from '../../config/postgres.js';
import ORDER_STATUS from '../../constants/orderStatus.js';

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    dateOrder: {
        type: DataTypes.DATE,
        field: 'dateOrder',
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    statusOrder: {
        type: DataTypes.STRING,
        field: 'statusOrder',
        allowNull: false,
        defaultValue: ORDER_STATUS.PENDING,
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        field: 'totalAmount',
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        field: 'userId',
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        field: 'createdAt',
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        field: 'updatedAt',
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'Orders',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    underscored: false
});

export default Order;
