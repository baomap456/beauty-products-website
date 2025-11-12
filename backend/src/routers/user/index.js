const express = require('express');
const router = express.Router();

// try {
const productsRouter = require('./products');
const categoriesRouter = require('./categories');
const brandsRouter = require('./brands');
const productImagesRouter = require('./productimages');
const cartRouter = require('./cart');
const ordersRouter = require('./orders');
const paymentsRouter = require('./payments');
const addressesRouter = require('./addresses');
const reviewRouter = require('./reviews');
const favoritesRouter = require('./favorites');
const discountsRouter = require('./discounts');

router.use('/products', productsRouter);
router.use('/categories', categoriesRouter);
router.use('/brands', brandsRouter);
router.use('/products/:id/images', productImagesRouter);
router.use('/cart', cartRouter);
router.use('/orders', ordersRouter);
router.use('/payments', paymentsRouter);
router.use('/addresses', addressesRouter);
router.use('/reviews', reviewRouter);
router.use('/favorites', favoritesRouter);
router.use('/discounts', discountsRouter);
// } catch (err) {
//     console.warn('Không thể load user subrouters:', err.message);
// }

module.exports = router;