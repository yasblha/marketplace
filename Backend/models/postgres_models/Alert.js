import { DataTypes } from 'sequelize';
import sequelize from '../../config/postgres.js';
import User from '../postgres_models/UserPg.js';
import Product from '../postgres_models/ProductPg.js';

const Alert = sequelize.define('Alert', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Clients',
            key: 'id'
        }
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Product',
            key: 'id'
        }
    },
    alert_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Alert',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Alert.belongsTo(User, { foreignKey: 'user_id' });
Alert.belongsTo(Product, { foreignKey: 'product_id' });

export default Alert;
