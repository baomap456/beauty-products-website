// models/order.js
'use strict';
module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        ID_Order: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        User_ID: { type: DataTypes.INTEGER, allowNull: false },
        Address_ID: { type: DataTypes.INTEGER, allowNull: true },
        Discount_ID: { type: DataTypes.INTEGER, allowNull: true },
        Total_Amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        Status: { type: DataTypes.ENUM('Pending', 'Processing', 'Shipping', 'Completed', 'Cancelled'), allowNull: false, defaultValue: 'Pending' }
    }, {
        tableName: 'Orders',
        timestamps: true
    });

    Order.associate = function (models) {
        Order.belongsTo(models.User, { foreignKey: 'User_ID' });
        Order.belongsTo(models.Address, { foreignKey: 'Address_ID' });
        Order.belongsTo(models.Discount, { foreignKey: 'Discount_ID' });
        Order.hasMany(models.OrderDetail, { foreignKey: 'Order_ID' });
        Order.hasOne(models.Payment, { foreignKey: 'Order_ID' });
    };

    return Order;
};
