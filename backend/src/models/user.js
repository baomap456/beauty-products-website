// models/user.js
'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        ID_User: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        FullName: { type: DataTypes.STRING(100), allowNull: false },
        Email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
        Password: { type: DataTypes.STRING(255), allowNull: false },
        Phone: { type: DataTypes.STRING(20), allowNull: true },
        Role_ID: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        tableName: 'Users',
        timestamps: true
    });

    User.associate = function (models) {
        User.belongsTo(models.Role, { foreignKey: 'Role_ID' });
        User.hasMany(models.Order, { foreignKey: 'User_ID' });
        User.hasMany(models.Review, { foreignKey: 'User_ID' });
        User.hasMany(models.Address, { foreignKey: 'User_ID' });
        User.hasMany(models.Favorite, { foreignKey: 'User_ID' });
    };

    return User;
};
