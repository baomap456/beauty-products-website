'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderDetails', {
      ID_OrderDetail: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Order_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Orders', key: 'ID_Order' },
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
      Quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderDetails');
  }
};
