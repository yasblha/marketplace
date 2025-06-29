import { DataTypes } from 'sequelize';
import sequelize from '../../config/postgres.js';
import User from './UserPg.js';

const Alert = sequelize.define('Alert', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM('new_product', 'restock', 'price_change', 'newsletter'),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    product_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    last_sent: {
        type: DataTypes.DATE,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    tableName: 'alerts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Associations
Alert.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Alert, { foreignKey: 'user_id', as: 'alerts' });

export default Alert;
