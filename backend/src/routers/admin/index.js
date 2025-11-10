const express = require('express');
const router = express.Router();

try {
    const productsRouter = require('./products');
    const categoriesRouter = require('./categories');
    const brandsRouter = require('./brands');
    const productImagesRouter = require('./productimages');
    const ordersRouter = require('./orders'); // admin orders routes
    const paymentsRouter = require('./payments'); // admin payments routes

    router.use('/products', productsRouter);
    router.use('/categories', categoriesRouter);
    router.use('/brands', brandsRouter);
    router.use('/products', productImagesRouter); // if images router uses /products/:id/images
    router.use('/orders', ordersRouter); // mount admin orders at /api/admin/orders
    router.use('/payments', paymentsRouter); // mount admin payments at /api/admin/payments
} catch (err) {
    console.warn('Không thể load admin subrouters:', err.message);
}

module.exports = router;