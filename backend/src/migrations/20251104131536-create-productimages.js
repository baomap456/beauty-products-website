'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductImages', {
      ID_Image: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      URL: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      Product_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'ID_Product'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductImages');
  }
};
