import { DataTypes } from 'sequelize';
import sequelize from '../../config/postgres.js';
import Client from './UserPg.js';
import Product from './ProductPg.js';

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
        field: 'userid',
        references: {
            model: 'Clients',
            key: 'id'
        }
    },
    productid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'productid',
        references: {
            model: 'Product',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'quantity'
    },
    sessionId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'session_id'
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
    underscored: true
});

// Définition des associations
Cart.belongsTo(Client, { foreignKey: 'userid' });
Cart.belongsTo(Product, { foreignKey: 'productid' });

Client.hasMany(Cart, { foreignKey: 'userid' });
Cart.belongsTo(Client, { foreignKey: 'userid' });

export default Cart;