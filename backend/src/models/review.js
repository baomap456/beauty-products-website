// models/review.js
'use strict';
module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
        ID_Review: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Product_ID: { type: DataTypes.INTEGER, allowNull: false },
        User_ID: { type: DataTypes.INTEGER, allowNull: false },
        Rating: { type: DataTypes.INTEGER, allowNull: false },
        Comment: { type: DataTypes.TEXT, allowNull: true }
    }, {
        tableName: 'Reviews',
        timestamps: true
    });

    Review.associate = function (models) {
        Review.belongsTo(models.Product, { foreignKey: 'Product_ID' });
        Review.belongsTo(models.User, { foreignKey: 'User_ID' });
    };

    return Review;
};
