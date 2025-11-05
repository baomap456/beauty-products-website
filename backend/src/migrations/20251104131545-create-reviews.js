'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      ID_Review: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
      },
      User_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'ID_User'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      Rating: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Comment: Sequelize.TEXT,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reviews');
  }
};
