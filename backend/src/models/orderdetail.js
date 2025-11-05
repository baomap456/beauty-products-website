// models/orderdetail.js
'use strict';
module.exports = (sequelize, DataTypes) => {
    const OrderDetail = sequelize.define('OrderDetail', {
        ID_OrderDetail: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Order_ID: { type: DataTypes.INTEGER, allowNull: false },
        Product_ID: { type: DataTypes.INTEGER, allowNull: false },
        Quantity: { type: DataTypes.INTEGER, allowNull: false },
        Price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
    }, {
        tableName: 'OrderDetails',
        timestamps: false
    });

    OrderDetail.associate = function (models) {
        OrderDetail.belongsTo(models.Order, { foreignKey: 'Order_ID' });
        OrderDetail.belongsTo(models.Product, { foreignKey: 'Product_ID' });
    };

    return OrderDetail;
};
