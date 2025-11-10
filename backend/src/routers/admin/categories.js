const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/category.controller');
const { verifyToken, isAdmin } = require('../../utils/jwt');

/**
 * @openapi
 * /api/admin/categories:
 *   post:
 *     summary: Tạo danh mục (admin)
 *     tags:
 *       - Categories (Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Name_Category
 *             properties:
 *               Name_Category:
 *                 type: string
 *                 example: "Chăm sóc da"
 *               Description:
 *                 type: string
 *                 example: "Mô tả danh mục"
 *     responses:
 *       201:
 *         description: Danh mục được tạo
 */
router.post('/categories', verifyToken, isAdmin, categoryController.createCategory);

/**
 * @openapi
 * /api/admin/categories:
 *   get:
 *     summary: Lấy danh sách danh mục (admin)
 *     tags:
 *       - Categories (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 */
router.get('/categories', verifyToken, isAdmin, categoryController.getAllCategories);

/**
 * @openapi
 * /api/admin/categories/{id}:
 *   get:
 *     summary: Lấy danh mục theo id (admin)
 *     tags:
 *       - Categories (Admin)
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
 *         description: Danh mục
 *       404:
 *         description: Không tìm thấy
 */
router.get('/categories/:id', verifyToken, isAdmin, categoryController.getCategoryById);

/**
 * @openapi
 * /api/admin/categories/{id}:
 *   put:
 *     summary: Cập nhật danh mục (admin)
 *     tags:
 *       - Categories (Admin)
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
 *               Name_Category:
 *                 type: string
 *                 example: "Tên mới"
 *               Description:
 *                 type: string
 *                 example: "Mô tả mới"
 *     responses:
 *       200:
 *         description: Đã cập nhật
 */
router.put('/categories/:id', verifyToken, isAdmin, categoryController.updateCategory);

/**
 * @openapi
 * /api/admin/categories/{id}:
 *   delete:
 *     summary: Xóa danh mục (admin)
 *     tags:
 *       - Categories (Admin)
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
router.delete('/categories/:id', verifyToken, isAdmin, categoryController.deleteCategory);

module.exports = router;