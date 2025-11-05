// models/brand.js
'use strict';
module.exports = (sequelize, DataTypes) => {
    const Brand = sequelize.define('Brand', {
        ID_Brand: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Name_Brand: { type: DataTypes.STRING(100), allowNull: false },
        Description: { type: DataTypes.TEXT, allowNull: true }
    }, {
        tableName: 'Brands',
        timestamps: false
    });

    Brand.associate = function (models) {
        Brand.hasMany(models.Product, { foreignKey: 'Brand_ID' });
    };

    return Brand;
};
