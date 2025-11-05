// models/payment.js
'use strict';
module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        ID_Payment: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Order_ID: { type: DataTypes.INTEGER, allowNull: false },
        Method: { type: DataTypes.ENUM('COD', 'Bank', 'MoMo'), allowNull: false },
        Status: { type: DataTypes.ENUM('Paid', 'Unpaid'), allowNull: false, defaultValue: 'Unpaid' },
        Note: { type: DataTypes.STRING(255), allowNull: true },
        PaymentDate: { type: DataTypes.DATE, allowNull: true }
    }, {
        tableName: 'Payments',
        timestamps: false
    });

    Payment.associate = function (models) {
        Payment.belongsTo(models.Order, { foreignKey: 'Order_ID' });
    };

    return Payment;
};
