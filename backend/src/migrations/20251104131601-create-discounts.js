'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Discounts', {
      ID_Discount: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      Type: {
        type: Sequelize.ENUM('Percent', 'Fixed'),
        allowNull: false
      },
      Value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      StartDate: Sequelize.DATEONLY,
      EndDate: Sequelize.DATEONLY
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Discounts');
  }
};
