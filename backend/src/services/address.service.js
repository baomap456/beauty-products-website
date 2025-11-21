const db = require('../models');
const Address = db.Address;
const sequelize = db.sequelize

async function createAddress(userId, data) {
    return sequelize.transaction(async (t) => {
        if (data.IsDefault) {
            await Address.update(
                { IsDefault: false },
                { where: { User_ID: userId }, transaction: t }
            );
        }

        // Tạo mới
        return await Address.create({ ...data, User_ID: userId }, { transaction: t });
    });
}

async function getAddressById(addressId) {
    return await Address.findByPk(addressId);
}

async function getAddressByUserId(userId) {
    return await Address.findAll({
        where: { User_ID: userId },
        order: [
            ['IsDefault', 'DESC'], // true (1) sẽ lên trước false (0)
            ['ID_Address', 'DESC'] // Mới nhất lên trên
        ]
    });
}

async function updateAddress(addressId, userId, data) {
    return sequelize.transaction(async (t) => {
        const address = await Address.findOne({
            where: { ID_Address: addressId, User_ID: userId },
            transaction: t
        });

        if (!address) throw new Error('Address not found');

        // Nếu user muốn đổi thằng này thành mặc định
        if (data.IsDefault) {
            await Address.update(
                { IsDefault: false },
                { where: { User_ID: userId }, transaction: t }
            );
        }

        return await address.update(data, { transaction: t });
    });
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
