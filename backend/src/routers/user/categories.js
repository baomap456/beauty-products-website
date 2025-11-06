const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/category.controller');
const { verifyToken } = require('../../utils/jwt');

/**
 * @openapi
 * /api/user/categories:
 *   get:
 *     summary: Lấy danh sách danh mục (user)
 *     tags:
 *       - Categories (User)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 */
router.get('/categories', categoryController.getAllCategories);

/**
 * @openapi
 * /api/user/categories/{id}:
 *   get:
 *     summary: Lấy danh mục theo id (user)
 *     tags:
 *       - Categories (User)
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
 *         description: Danh mục
 *       404:
 *         description: Không tìm thấy
 */
router.get('/categories/:id', categoryController.getCategoryById);

module.exports = router;