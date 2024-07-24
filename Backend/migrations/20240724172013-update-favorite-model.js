'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Étape 1: Ajouter temporairement la colonne productid comme nullable
        await queryInterface.addColumn('Favorite', 'productid', {
            type: Sequelize.INTEGER,
            allowNull: true, // temporairement nullable
            references: {
                model: 'Product',
                key: 'id'
            }
        });

        // Étape 2: Mettre à jour toutes les lignes existantes pour attribuer une valeur productid
        await queryInterface.sequelize.query(`
            UPDATE "Favorite"
            SET "productid" = subquery."id"
            FROM (
                SELECT "id"
                FROM "Product"
                LIMIT 1
            ) AS subquery
            WHERE "productid" IS NULL
        `);

        // Étape 3: Rendre la colonne productid non nullable
        await queryInterface.changeColumn('Favorite', 'productid', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Product',
                key: 'id'
            }
        });

        // Étape 4: Supprimer la colonne productids
        await queryInterface.removeColumn('Favorite', 'productids');
    },

    down: async (queryInterface, Sequelize) => {
        // Revenir en arrière: Ajouter de nouveau la colonne productids et supprimer la colonne productid
        await queryInterface.addColumn('Favorite', 'productids', {
            type: Sequelize.ARRAY(Sequelize.INTEGER),
            allowNull: true,
            defaultValue: []
        });

        await queryInterface.removeColumn('Favorite', 'productid');
    }
};
