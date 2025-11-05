'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      ID_Payment: {
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
      Method: {
        type: Sequelize.ENUM('COD', 'Bank', 'MoMo'),
        allowNull: false
      },
      Status: {
        type: Sequelize.ENUM('Paid', 'Unpaid'),
        defaultValue: 'Unpaid'
      },
      Note: Sequelize.STRING(255),
      PaymentDate: Sequelize.DATE
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Payments');
  }
};
