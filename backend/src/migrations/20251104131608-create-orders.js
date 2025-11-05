'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      ID_Order: {
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
      Address_ID: {
        type: Sequelize.INTEGER,
        references: { model: 'Addresses', key: 'ID_Address' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      Discount_ID: {
        type: Sequelize.INTEGER,
        references: { model: 'Discounts', key: 'ID_Discount' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      Total_Amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      Status: {
        type: Sequelize.ENUM('Pending', 'Processing', 'Shipping', 'Completed', 'Cancelled'),
        defaultValue: 'Pending'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};
