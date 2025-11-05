// models/product.js
'use strict';
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        ID_Product: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Name_Product: { type: DataTypes.STRING(100), allowNull: false },
        Price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        Stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        Description: { type: DataTypes.TEXT, allowNull: true },
        Category_ID: { type: DataTypes.INTEGER, allowNull: true },
        Brand_ID: { type: DataTypes.INTEGER, allowNull: true }
    }, {
        tableName: 'Products',
        timestamps: true
    });

    Product.associate = function (models) {
        Product.belongsTo(models.Category, { foreignKey: 'Category_ID' });
        Product.belongsTo(models.Brand, { foreignKey: 'Brand_ID' });
        Product.hasMany(models.ProductImage, { foreignKey: 'Product_ID' });
        Product.hasMany(models.Review, { foreignKey: 'Product_ID' });
        Product.hasMany(models.OrderDetail, { foreignKey: 'Product_ID' });
        Product.hasMany(models.Favorite, { foreignKey: 'Product_ID' });
    };

    return Product;
};
