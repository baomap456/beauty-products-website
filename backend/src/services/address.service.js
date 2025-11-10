const db = require('../models');
const Address = db.Address;

async function createAddress(userId, data) {
    if (data.IsDefault) {
        await Address.update({ IsDefault: false }, { where: { User_ID: userId } });
    }
    return await Address.create({ ...data, User_ID: userId });
}

async function getAddressById(addressId) {
    return await Address.findByPk(addressId);
}

async function getAddressByUserId(userId) {
    return await Address.findAll({ where: { User_ID: userId } });
}

async function updateAddress(addressId, userId, data) {
    if (data.IsDefault) {
        await Address.update({ IsDefault: false }, { where: { User_ID: userId } });
    }
    const address = await Address.findOne({ where: { ID_Address: addressId, User_ID: userId } });
    if (!address) throw new Error('Address not found');
    return await address.update(data);
}

async function deleteAddress(addressId, userId) {
    const address = await Address.findOne({ where: { ID_Address: addressId, User_ID: userId } });
    if (!address) throw new Error('Address not found');
    await address.destroy();
    return true;
}

module.exports = {
    createAddress,
    getAddressById,
    getAddressByUserId,
    updateAddress,
    deleteAddress,
};
