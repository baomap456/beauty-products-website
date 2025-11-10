const cartService = require('../services/cart.service');

// helper to get user id from req.user (token payload variations)
function getUserIdFromReq(req) {
    const u = req.user || {};
    return u.sub || u.id || u.ID_User || u.User_ID || u.userId || null;
}

const getMyCart = async (req, res) => {
    try {
        const userId = getUserIdFromReq(req);
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const cart = await cartService.getCartByUser(userId);
        return res.json(cart || { items: [], Total: 0 });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
};

const addItem = async (req, res) => {
    try {
        const userId = getUserIdFromReq(req);
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { productId, quantity } = req.body;
        if (!productId) return res.status(400).json({ message: 'productId required' });

        const result = await cartService.addItemToCart(userId, productId, Number(quantity || 1));
        return res.status(201).json(result);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: err.message || 'Error adding item' });
    }
};

const updateItem = async (req, res) => {
    try {
        const userId = getUserIdFromReq(req);
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const cartItemId = req.params.itemId;
        const { quantity } = req.body;
        if (!cartItemId) return res.status(400).json({ message: 'itemId required' });

        const result = await cartService.updateCartItem(userId, cartItemId, Number(quantity));
        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: err.message || 'Error updating item' });
    }
};

const removeItem = async (req, res) => {
    try {
        const userId = getUserIdFromReq(req);
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const cartItemId = req.params.itemId;
        if (!cartItemId) return res.status(400).json({ message: 'itemId required' });

        const result = await cartService.removeCartItem(userId, cartItemId);
        return res.status(204).send();
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: err.message || 'Error removing item' });
    }
};

const clear = async (req, res) => {
    try {
        const userId = getUserIdFromReq(req);
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const cart = await cartService.clearCart(userId);
        return res.json(cart || { items: [], Total: 0 });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message || 'Error clearing cart' });
    }
};

module.exports = {
    getMyCart,
    addItem,
    updateItem,
    removeItem,
    clear
};