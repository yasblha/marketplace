import { DataTypes } from 'sequelize';
import sequelize from '../../config/postgres.js';
import Product from './ProductPg.js';

const Media = sequelize.define('Media', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id'
    },
    productId: {
        type: DataTypes.INTEGER,
        field: 'product_id',
        references: {
            model: Product,
            key: 'id'
        },
        allowNull: false
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'path'
    }
}, {
    tableName: 'Media',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    indexes: [
        {
            fields: ['product_id']
        }
    ]
});

// Associations
Product.hasMany(Media, { 
    foreignKey: 'product_id',
    as: 'media'
});

Media.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product'
});

export default Media;
