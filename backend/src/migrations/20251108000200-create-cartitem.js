'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('CartItems', {
            ID_CartItem: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            Cart_ID: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            Product_ID: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            Quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            Price: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false
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

        // foreign keys (optional): reference Carts and Products if exist
        // await queryInterface.addConstraint('CartItems', {
        //   fields: ['Cart_ID'],
        //   type: 'foreign key',
        //   name: 'fk_cartitems_cart',
        //   references: { table: 'Carts', field: 'ID_Cart' },
        //   onDelete: 'CASCADE', onUpdate: 'CASCADE'
        // });
        // await queryInterface.addConstraint('CartItems', {
        //   fields: ['Product_ID'],
        //   type: 'foreign key',
        //   name: 'fk_cartitems_product',
        //   references: { table: 'Products', field: 'ID_Product' },
        //   onDelete: 'RESTRICT', onUpdate: 'CASCADE'
        // });
    },

    down: async (queryInterface, Sequelize) => {
        // remove constraints if added
        // await queryInterface.removeConstraint('CartItems', 'fk_cartitems_cart');
        // await queryInterface.removeConstraint('CartItems', 'fk_cartitems_product');
        await queryInterface.dropTable('CartItems');
    }
};