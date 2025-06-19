import { DataTypes } from 'sequelize';
import sequelize from '../../config/postgres.js';
import Client from './UserPg.js';
import Product from './ProductPg.js';

const Favorite = sequelize.define('Favorite', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Clients',
            key: 'id'
        }
    },
    productids: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: [],
        allowNull: true,
    }

}, {
    tableName: 'favorites',
    timestamps: false,
});

// Définition des associations
Favorite.belongsTo(Client, { foreignKey: 'userid' });

// Product n'est pas directement associé ici car productids est une liste d'IDs, pas des objets Product
// Les produits doivent être récupérés séparément lors de l'affichage des favoris

export default Favorite;