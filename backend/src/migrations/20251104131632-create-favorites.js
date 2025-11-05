'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Favorites', {
      ID_Favorite: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      User_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'ID_User' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      Product_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Products', key: 'ID_Product' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Favorites');
  }
};
