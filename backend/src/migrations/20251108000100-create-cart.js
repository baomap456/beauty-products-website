'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Carts', {
            ID_Cart: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            User_ID: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            Status: {
                type: Sequelize.STRING(50),
                allowNull: false,
                defaultValue: 'active'
            },
            Total: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });

        // Optional: add FK to Users table if it exists
        // await queryInterface.addConstraint('Carts', {
        //   fields: ['User_ID'],
        //   type: 'foreign key',
        //   name: 'fk_carts_user',
        //   references: {
        //     table: 'Users',
        //     field: 'ID_User'
        //   },
        //   onDelete: 'CASCADE',
        //   onUpdate: 'CASCADE'
        // });
    },

    down: async (queryInterface, Sequelize) => {
        // remove constraint if added above
        // await queryInterface.removeConstraint('Carts', 'fk_carts_user');
        await queryInterface.dropTable('Carts');
    }
};