const express = require('express');
const router = express.Router();

// thêm những router dành cho user ở đây
try {
    const productsRouter = require('./products');
    router.use('/', productsRouter); // maps to /api/user/products...
} catch (err) {
    console.warn('Không thể load user subrouters:', err.message);
}

module.exports = router;