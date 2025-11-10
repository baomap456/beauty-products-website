const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/productimage.controller');
const { verifyToken } = require('../../utils/jwt');

/**
 * @openapi
 * /api/user/products/{id}/images:
 *   get:
 *     summary: List images for a product (user)
 *     tags:
 *       - Product Images (User)
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id/images', ctrl.listImages);

module.exports = router;