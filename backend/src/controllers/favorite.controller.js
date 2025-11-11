const favoriteService = require('../services/favorite.service');

async function addFavorite(req, res) {
    try {
        const userId = req.user.id;
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ error: 'Missing productId' });
        }
        const fav = await favoriteService.addFavorite(userId, productId);
        return res.status(201).json(fav);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function removeFavorite(req, res) {
    try {
        const userId = req.user.id;
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ error: 'Missing productId' });
        }
        const deletedCount = await favoriteService.removeFavorite(userId, productId);
        if (deletedCount === 0) return res.status(404).json({ error: 'Favorite not found' });
        return res.status(200).json({ deletedCount });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getFavoritesByUser(req, res) {
    try {
        const userId = req.user.id;
        const favs = await favoriteService.getFavoritesByUser(userId);
        res.status(200).json(favs ?? []);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
async function countFavoritesByProduct(req, res) {
    try {
        const productId = req.params.productId;
        if (!productId) return res.status(400).json({ error: 'Missing productId' });
        const count = await favoriteService.countFavoritesByProduct(productId);
        res.status(200).json({ count });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function toggleFavorite(req, res) {
    try {
        const userId = req.user.id;
        const { productId } = req.body;
        if (!productId) return res.status(400).json({ error: 'Missing productId' });

        const exists = await favoriteService.isFavoriteExists(userId, productId);
        if (exists) {
            await favoriteService.removeFavorite(userId, productId);
            return res.status(200).json({ message: 'Removed from favorites' });
        } else {
            const fav = await favoriteService.addFavorite(userId, productId);
            return res.status(201).json(fav);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    addFavorite,
    removeFavorite,
    getFavoritesByUser,
    countFavoritesByProduct,
    toggleFavorite
};