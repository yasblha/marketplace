import { DataTypes } from 'sequelize';
import sequelize from '../../config/postgres.js';

const OrderDetails = sequelize.define('OrderDetails', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    orderId: {
        type: DataTypes.INTEGER,
        field: 'orderId',
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER,
        field: 'productId',
        allowNull: false,
    },
    productName: {
        type: DataTypes.STRING,
        field: 'productName',
        allowNull: false,
    },
    productDescription: {
        type: DataTypes.STRING,
        field: 'productDescription',
        allowNull: false,
    },
    productCategory: {
        type: DataTypes.STRING,
        field: 'productCategory',
        allowNull: false,
    },
    productBrand: {
        type: DataTypes.STRING,
        field: 'productBrand',
        allowNull: false,
    },
    unitPrice: {
        type: DataTypes.FLOAT,
        field: 'unitPrice',
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        field: 'quantity',
        allowNull: false,
    },
    subtotal: {
        type: DataTypes.FLOAT,
        field: 'subtotal',
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
    tableName: 'OrderDetails',
    timestamps: true,
    freezeTableName: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    underscored: false
});

export default OrderDetails;