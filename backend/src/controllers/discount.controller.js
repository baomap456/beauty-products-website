const discountService = require('../services/discount.service');

async function createDiscount(req, res) {
    try {
        const newDiscount = await discountService.createDiscount(req.body);
        return res.status(201).json(newDiscount);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

async function getAllDiscounts(req, res) {
    try {
        const list = await discountService.getAllDiscounts();
        return res.status(200).json(list);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

async function getDiscountById(req, res) {
    try {
        const item = await discountService.getDiscountById(req.params.id);
        if (item) return res.status(200).json(item);
        return res.status(404).json({ message: 'Discount not found' });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

async function updateDiscount(req, res) {
    try {
        const updated = await discountService.updateDiscount(req.params.id, req.body);
        return res.status(200).json(updated);
    } catch (e) {
        if (e.message === 'Discount not found') return res.status(404).json({ message: e.message });
        return res.status(500).json({ message: e.message });
    }
}

async function deleteDiscount(req, res) {
    try {
        await discountService.deleteDiscount(req.params.id);
        return res.status(204).send();
    } catch (e) {
        if (e.message === 'Discount not found') return res.status(404).json({ message: e.message });
        return res.status(500).json({ message: e.message });
    }
}

async function applyDiscount(req, res) {
    const { code, orderTotal } = req.body || {};
    if (code == null || orderTotal == null) return res.status(400).json({ message: 'Missing code or orderTotal' });
    try {
        const finalTotal = await discountService.applyDiscountToOrder(code, orderTotal);
        return res.status(200).json({ finalTotal });
    } catch (e) {
        if (['Discount not found', 'Discount not yet valid', 'Discount expired', 'Invalid discount value'].includes(e.message)) {
            return res.status(400).json({ message: e.message });
        }
        return res.status(500).json({ message: e.message });
    }
}

async function getActiveDiscounts(req, res) {
    try {
        const list = await discountService.getActiveDiscounts();
        return res.status(200).json(list);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

async function getExpiredDiscounts(req, res) {
    try {
        const list = await discountService.getExpiredDiscounts();
        return res.status(200).json(list);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

module.exports = {
    createDiscount,
    getAllDiscounts,
    getDiscountById,
    updateDiscount,
    deleteDiscount,
    applyDiscount,
    getActiveDiscounts,
    getExpiredDiscounts
};