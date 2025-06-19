import { DataTypes } from 'sequelize';
import sequelize from '../../config/postgres.js';
import Order from './Commande.js';
import Product from './ProductPg.js';

const OrderDetails = sequelize.define('OrderDetails', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    orderId: {
        type: DataTypes.INTEGER,
        field: 'orderId',
        references: {
            model: 'Orders',
            key: 'id',
        },
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER,
        field: 'productId',
        references: {
            model: 'Product',
            key: 'id',
        },
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
    underscored: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

// Relations
OrderDetails.associate = (models) => {
    OrderDetails.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order'
    });
    
    OrderDetails.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
    });
};

export default OrderDetails;