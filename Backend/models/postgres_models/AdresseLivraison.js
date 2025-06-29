import { DataTypes } from 'sequelize';
import sequelize from '../../config/postgres.js';
import User from '../postgres_models/UserPg.js';

const DeliveryAddress = sequelize.define('DeliveryAddress', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    postalcode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    department: {
        type: DataTypes.STRING,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        field: 'userId',
        references: {
            model: User,
            key: 'id'
        },
        allowNull: false
    }
},{
    tableName: 'DeliveryAddresses',
    timestamps: false,
});

DeliveryAddress.belongsTo(User, { foreignKey: 'userId' });

export default DeliveryAddress;
