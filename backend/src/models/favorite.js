// models/favorite.js
'use strict';
module.exports = (sequelize, DataTypes) => {
    const Favorite = sequelize.define('Favorite', {
        ID_Favorite: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        User_ID: { type: DataTypes.INTEGER, allowNull: false },
        Product_ID: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        tableName: 'Favorites',
        timestamps: true
    });

    Favorite.associate = function (models) {
        Favorite.belongsTo(models.User, { foreignKey: 'User_ID' });
        Favorite.belongsTo(models.Product, { foreignKey: 'Product_ID' });
    };

    return Favorite;
};
