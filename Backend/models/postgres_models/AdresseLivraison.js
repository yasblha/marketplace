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
    userid: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
},{
    tableName: 'DeliveryAdress',
    timestamps: false,});

DeliveryAddress.belongsTo(User, { foreignKey: 'userid' });

export default DeliveryAddress;
