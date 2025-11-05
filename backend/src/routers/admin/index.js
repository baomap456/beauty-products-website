const express = require('express');
const router = express.Router();

try {
    const adminProducts = require('./products');
    router.use('/', adminProducts); // maps to /api/admin/...
} catch (err) {
    console.warn('Không thể load admin subrouters:', err.message);
}

module.exports = router;