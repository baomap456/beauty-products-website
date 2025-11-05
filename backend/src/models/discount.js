// models/discount.js
'use strict';
module.exports = (sequelize, DataTypes) => {
    const Discount = sequelize.define('Discount', {
        ID_Discount: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
        Type: { type: DataTypes.ENUM('Percent', 'Fixed'), allowNull: false },
        Value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        StartDate: { type: DataTypes.DATEONLY, allowNull: true },
        EndDate: { type: DataTypes.DATEONLY, allowNull: true }
    }, {
        tableName: 'Discounts',
        timestamps: false
    });

    Discount.associate = function (models) {
        Discount.hasMany(models.Order, { foreignKey: 'Discount_ID' });
    };

    return Discount;
};
