'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Order', 'productIds', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Order', 'productIds');
  },
};
