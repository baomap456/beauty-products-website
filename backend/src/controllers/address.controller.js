const addressService = require('../services/address.service');

const createAddress = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.sub;
        const newAddress = await addressService.createAddress(userId, req.body);
        res.status(201).json(newAddress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAddress = async (req, res) => {
    try {
        const addressId = parseInt(req.params.id, 10);
        if (isNaN(addressId)) return res.status(400).json({ error: 'Invalid address ID' });

        const address = await addressService.getAddressById(addressId);
        if (!address) return res.status(404).json({ error: 'Address not found' });

        res.json(address);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserAddresses = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.sub;
        const addresses = await addressService.getAddressByUserId(userId);
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateAddress = async (req, res) => {
    try {
        const addressId = parseInt(req.params.id, 10);
        const userId = req.user?.id || req.user?.sub;

        const updatedAddress = await addressService.updateAddress(addressId, userId, req.body);
        res.json(updatedAddress);
    } catch (error) {
        if (error.message === 'Address not found') return res.status(404).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const addressId = parseInt(req.params.id, 10);
        const userId = req.user?.id || req.user?.sub;

        await addressService.deleteAddress(addressId, userId);
        res.status(204).send();
    } catch (error) {
        if (error.message === 'Address not found') return res.status(404).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createAddress,
    getAddress,
    getUserAddresses,
    updateAddress,
    deleteAddress
};
