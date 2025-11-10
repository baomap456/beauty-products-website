'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('ProductImages', 'isPrimary', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            after: 'Product_ID' // optional: MySQL-specific placement
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('ProductImages', 'isPrimary');
    }
};