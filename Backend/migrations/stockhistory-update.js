export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn('StockHistory', 'productId', {
    type: Sequelize.STRING,
    allowNull: false
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn('StockHistory', 'productId', {
    type: Sequelize.INTEGER,
    references: { model: 'Products', key: 'id' }
  });
}
