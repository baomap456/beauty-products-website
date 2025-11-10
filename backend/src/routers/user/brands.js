const express = require('express');
const router = express.Router();
const brandController = require('../../controllers/brand.controller');

// Public: anyone can view brands
/**
 * @openapi
 * /api/user/brands:
 *   get:
 *     summary: Public - list brands
 *     tags:
 *       - Brands (Public)
 *     responses:
 *       200:
 *         description: Danh sách thương hiệu
 */
router.get('/brands', brandController.getAllBrands);

/**
 * @openapi
 * /api/user/brands/{id}:
 *   get:
 *     summary: Public - get brand by id
 *     tags:
 *       - Brands (Public)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thương hiệu
 *       404:
 *         description: Không tìm thấy thương hiệu
 */
router.get('/brands/:id', brandController.getBrandById);

module.exports = router;