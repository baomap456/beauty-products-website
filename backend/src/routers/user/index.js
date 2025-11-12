const express = require('express');
const router = express.Router();

function isValid(r) {
    return r && (typeof r === 'function' || typeof r.use === 'function');
}

try {
    const productsRouter = require('./products');
    const categoriesRouter = require('./categories');
    const brandsRouter = require('./brands');
    const productImagesRouter = require('./productimages');
    const cartRouter = require('./cart');
    const ordersRouter = require('./orders');
    const paymentsRouter = require('./payments');
    const addressesRouter = require('./addresses');
    const reviewRouter = require('./reviews');
    const favoritesRouter = require('./favorites'); // mới
    const discountsRouter = require('./discounts');

    if (isValid(productsRouter)) router.use('/products', productsRouter);
    if (isValid(categoriesRouter)) router.use('/categories', categoriesRouter);
    if (isValid(brandsRouter)) router.use('/brands', brandsRouter);
    if (isValid(productImagesRouter)) router.use('/products', productImagesRouter); // nếu router này định nghĩa /:id/images
    if (isValid(cartRouter)) router.use('/cart', cartRouter);
    if (isValid(ordersRouter)) router.use('/orders', ordersRouter);
    if (isValid(paymentsRouter)) router.use('/payments', paymentsRouter);
    if (isValid(addressesRouter)) router.use('/addresses', addressesRouter);
    if (isValid(reviewRouter)) router.use('/reviews', reviewRouter);
    if (isValid(favoritesRouter)) router.use('/favorites', favoritesRouter);
    if (isValid(discountsRouter)) router.use('/discounts', discountsRouter);
} catch (err) {
    console.warn('Không thể load user subrouters:', err.message);
}

module.exports = router;