import { DataTypes } from 'sequelize';
import sequelize from '../../config/postgres.js';

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id'
    },
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'userid'
    },
    productid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'productid'
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'quantity'
    },
    reservedUntil: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'reserved_until'
    },
    createdAt: {
        type: DataTypes.DATE,
        field: 'created_at'
    },
    updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at'
    }
}, {
    tableName: 'Cart',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
});

export default Cart;