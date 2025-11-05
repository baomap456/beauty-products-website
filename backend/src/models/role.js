// models/role.js
'use strict';
module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        ID_Role: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Name_Role: { type: DataTypes.STRING(50), allowNull: false }
    }, {
        tableName: 'Roles',
        timestamps: false
    });

    Role.associate = function (models) {
        Role.hasMany(models.User, { foreignKey: 'Role_ID' });
    };

    return Role;
};
