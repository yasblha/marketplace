'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Favorite', 'productid', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Products',
                key: 'id'
            }
        });

        await queryInterface.removeColumn('Favorite', 'productids');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Favorite', 'productids', {
            type: Sequelize.ARRAY(Sequelize.INTEGER),
            allowNull: true,
            defaultValue: []
        });

        await queryInterface.removeColumn('Favorite', 'productid');
    }
};
