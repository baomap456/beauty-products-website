'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Addresses', {
      ID_Address: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
      RecipientName: Sequelize.STRING(100),
      Phone: Sequelize.STRING(20),
      AddressDetail: Sequelize.STRING(255),
      Province: Sequelize.STRING(100),
      District: Sequelize.STRING(100),
      Ward: Sequelize.STRING(100),
      IsDefault: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Addresses');
  }
};
