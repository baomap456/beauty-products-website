'use strict';
module.exports = (sequelize, DataTypes) => {
    const CartItem = sequelize.define('CartItem', {
        ID_CartItem: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Cart_ID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Product_ID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        Price: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        }
    }, {
        tableName: 'CartItems',
        timestamps: true
    });

    CartItem.associate = function (models) {
        CartItem.belongsTo(models.Cart, { foreignKey: 'Cart_ID', as: 'cart' });
        CartItem.belongsTo(models.Product, { foreignKey: 'Product_ID', as: 'product' });
    };

    return CartItem;
};