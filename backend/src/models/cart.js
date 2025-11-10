'use strict';
module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
        ID_Cart: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        User_ID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Status: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'active' // active, ordered, cancelled, ...
        },
        Total: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true
        }
    }, {
        tableName: 'Carts',
        timestamps: true
    });

    Cart.associate = function (models) {
        Cart.hasMany(models.CartItem, { foreignKey: 'Cart_ID', as: 'items', onDelete: 'CASCADE' });
        // optional: Cart.belongsTo(models.User, { foreignKey: 'User_ID' });
    };

    return Cart;
};