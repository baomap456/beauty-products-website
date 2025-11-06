const express = require('express');
const router = express.Router();
const brandController = require('../../controllers/brand.controller');
const { verifyToken } = require('../../utils/jwt');

/**
 * @openapi
 * /api/user/brands:
 *   get:
 *     summary: Lấy danh sách thương hiệu (user)
 *     tags:
 *       - Brands (User)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách thương hiệu
 */
router.get('/brands', brandController.getAllBrands);

/**
 * @openapi
 * /api/user/brands/{id}:
 *   get:
 *     summary: Lấy thương hiệu theo id (user)
 *     tags:
 *       - Brands (User)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thương hiệu
 *       404:
 *         description: Không tìm thấy
 */
router.get('/brands/:id', brandController.getBrandById);

module.exports = router;