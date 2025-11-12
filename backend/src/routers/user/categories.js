const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/category.controller');

// Public: anyone can view categories
/**
 * @openapi
 * /api/user/categories:
 *   get:
 *     summary: Public - list categories
 *     tags:
 *       - Categories (Public)
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 */
router.get('/', categoryController.getAllCategories);

/**
 * @openapi
 * /api/user/categories/{id}:
 *   get:
 *     summary: Public - get category by id
 *     tags:
 *       - Categories (Public)
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
 *         description: Không tìm thấy danh mục
 */
router.get('/:id', categoryController.getCategoryById);

module.exports = router;