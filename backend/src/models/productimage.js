// models/productimage.js
'use strict';
module.exports = (sequelize, DataTypes) => {
    const ProductImage = sequelize.define('ProductImage', {
        ID_Image: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        URL: { type: DataTypes.STRING(255), allowNull: false },
        Product_ID: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        tableName: 'ProductImages',
        timestamps: false
    });

    ProductImage.associate = function (models) {
        ProductImage.belongsTo(models.Product, { foreignKey: 'Product_ID' });
    };

    return ProductImage;
};
