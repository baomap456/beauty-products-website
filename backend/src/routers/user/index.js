const express = require('express');
const router = express.Router();

// thêm những router dành cho user ở đây
try {
    const productsRouter = require('./products');
    const categoriesRouter = require('./categories');
    const brandsRouter = require('./brands');
    const productImagesRouter = require('./productimages');
    const cartRouter = require('./cart');
    const ordersRouter = require('./orders');

    router.use('/', productsRouter); // maps to /api/user/products...
    router.use('/', categoriesRouter); // maps to /api/user/categories...
    router.use('/', brandsRouter); // maps to /api/user/brands...
    router.use('/', productImagesRouter); // maps to /api/user/products/:id/images

    // cart endpoints -> /api/user/cart
    router.use('/cart', cartRouter);

    // orders endpoints -> /api/user/orders
    router.use('/orders', ordersRouter);
} catch (err) {
    console.warn('Không thể load user subrouters:', err.message);
}

module.exports = router;