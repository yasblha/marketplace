import { DataTypes } from 'sequelize';
import sequelize from '../../config/postgres.js';
import Clients from '../postgres_models/UserPg.js';
import ORDER_STATUS from '../../constants/orderStatus.js';

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    dateOrder: {
        type: DataTypes.DATE,
        field: 'date_order',
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    statusOrder: {
        type: DataTypes.STRING,
        field: 'status_order',
        allowNull: false,
        defaultValue: ORDER_STATUS.PENDING,
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        field: 'total_amount',
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        field: 'userId',
        references: {
            model: Clients,
            key: 'id',
        },
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
    underscored: true,
    freezeTableName: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

// Relations
Order.associate = (models) => {
    Order.belongsTo(models.Clients, {
        foreignKey: 'userId',
        as: 'user'
    });
    
    Order.hasMany(models.OrderDetails, {
        foreignKey: 'orderId',
        as: 'OrderDetails'
    });
};

export default Order;
