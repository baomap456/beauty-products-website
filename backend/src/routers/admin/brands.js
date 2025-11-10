const express = require('express');
const router = express.Router();
const brandController = require('../../controllers/brand.controller');
const { verifyToken, isAdmin } = require('../../utils/jwt');

/**
 * @openapi
 * /api/admin/brands:
 *   post:
 *     summary: Tạo thương hiệu (admin)
 *     tags:
 *       - Brands (Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Name_Brand
 *             properties:
 *               Name_Brand:
 *                 type: string
 *                 example: "Thương hiệu A"
 *               Description:
 *                 type: string
 *                 example: "Mô tả thương hiệu"
 *     responses:
 *       201:
 *         description: Thương hiệu được tạo
 */
router.post('/brands', verifyToken, isAdmin, brandController.createBrand);

/**
 * @openapi
 * /api/admin/brands:
 *   get:
 *     summary: Lấy danh sách thương hiệu (admin)
 *     tags:
 *       - Brands (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách thương hiệu
 */
router.get('/brands', verifyToken, isAdmin, brandController.getAllBrands);

/**
 * @openapi
 * /api/admin/brands/{id}:
 *   get:
 *     summary: Lấy thương hiệu theo id (admin)
 *     tags:
 *       - Brands (Admin)
 *     security:
 *       - bearerAuth: []
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
 *         description: Không tìm thấy
 */
router.get('/brands/:id', verifyToken, isAdmin, brandController.getBrandById);

/**
 * @openapi
 * /api/admin/brands/{id}:
 *   put:
 *     summary: Cập nhật thương hiệu (admin)
 *     tags:
 *       - Brands (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name_Brand:
 *                 type: string
 *                 example: "Tên mới"
 *               Description:
 *                 type: string
 *                 example: "Mô tả mới"
 *     responses:
 *       200:
 *         description: Đã cập nhật
 */
router.put('/brands/:id', verifyToken, isAdmin, brandController.updateBrand);

/**
 * @openapi
 * /api/admin/brands/{id}:
 *   delete:
 *     summary: Xóa thương hiệu (admin)
 *     tags:
 *       - Brands (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Đã xóa
 */
router.delete('/brands/:id', verifyToken, isAdmin, brandController.deleteBrand);

module.exports = router;