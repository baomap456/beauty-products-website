'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      ID_User: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      FullName: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      Email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      Password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      Phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      Role_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Roles',
          key: 'ID_Role'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
