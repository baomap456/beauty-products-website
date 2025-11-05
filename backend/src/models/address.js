// models/address.js
'use strict';
module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define('Address', {
        ID_Address: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        User_ID: { type: DataTypes.INTEGER, allowNull: false },
        RecipientName: { type: DataTypes.STRING(100), allowNull: false },
        Phone: { type: DataTypes.STRING(20), allowNull: false },
        AddressDetail: { type: DataTypes.STRING(255), allowNull: false },
        Province: { type: DataTypes.STRING(100), allowNull: true },
        District: { type: DataTypes.STRING(100), allowNull: true },
        Ward: { type: DataTypes.STRING(100), allowNull: true },
        IsDefault: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    }, {
        tableName: 'Addresses',
        timestamps: false
    });

    Address.associate = function (models) {
        Address.belongsTo(models.User, { foreignKey: 'User_ID' });
        Address.hasMany(models.Order, { foreignKey: 'Address_ID' });
    };

    return Address;
};
