'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      ID_Product: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Name_Product: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      Price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      Stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      Description: Sequelize.TEXT,
      Category_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Categories',
          key: 'ID_Category'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      Brand_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Brands',
          key: 'ID_Brand'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};
