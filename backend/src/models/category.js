// models/category.js
'use strict';
module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        ID_Category: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Name_Category: { type: DataTypes.STRING(100), allowNull: false },
        Description: { type: DataTypes.TEXT, allowNull: true }
    }, {
        tableName: 'Categories',
        timestamps: false
    });

    Category.associate = function (models) {
        Category.hasMany(models.Product, { foreignKey: 'Category_ID' });
    };

    return Category;
};
