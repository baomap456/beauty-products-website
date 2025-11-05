'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Brands', {
      ID_Brand: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Name_Brand: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      Description: Sequelize.TEXT
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Brands');
  }
};
