const db = require('../models');
const favorite = db.Favorite;

async function addFavorite(userId, productId) {
    const existingfav = await favorite.findOne({ where: { User_ID: userId, Product_ID: productId } });
    if (existingfav) {
        throw new Error('Favorite already exists');
    }
    const fav = await favorite.create({ User_ID: userId, Product_ID: productId });
    return fav;
}

async function removeFavorite(userId, productId) {
    const deletedCount = await favorite.destroy({ where: { User_ID: userId, Product_ID: productId } });
    return deletedCount;
}

async function getFavoritesByUser(userId) {
    const favs = await favorite.findAll({ where: { User_ID: userId }, include: [{ model: db.Product }] });
    return favs;
}

async function isFavoriteExists(userId, productId) {
    const fav = await favorite.findOne({ where: { User_ID: userId, Product_ID: productId } });
    return !!fav;
}

async function countFavoritesByProduct(productId) {
    const count = await favorite.count({ where: { Product_ID: productId } });
    return count;
}

module.exports = {
    addFavorite,
    removeFavorite,
    getFavoritesByUser,
    countFavoritesByProduct,
    isFavoriteExists
};