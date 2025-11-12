const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');

/**
 * @openapi
 * /api/user/products:
 *   get:
 *     summary: Lấy danh sách sản phẩm (public)
 *     tags:
 *       - Products (Public)
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 */
router.get('/', productController.getAllProducts);

/**
 * @openapi
 * /api/user/products/{id}:
 *   get:
 *     summary: Lấy sản phẩm theo id (public)
 *     tags:
 *       - Products (Public)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin sản phẩm
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.get('/:id', productController.getProductById);

/**
 * @openapi
 * /api/user/products/paginated:
 *   get:
 *     summary: Lấy sản phẩm phân trang (public)
 *     tags:
 *       - Products (Public)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách phân trang
 */
router.get('/paginated', productController.getPaginatedProducts);

/**
 * @openapi
 * /api/user/products/search:
 *   get:
 *     summary: Tìm kiếm sản phẩm (public)
 *     tags:
 *       - Products (Public)
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm
 */
router.get('/search', productController.searchProduct);

/**
 * @openapi
 * /api/user/products/filter:
 *   post:
 *     summary: Lọc sản phẩm (public)
 *     tags:
 *       - Products (Public)
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Danh sách đã lọc
 */
router.post('/filter', productController.filterProducts);

/**
 * @openapi
 * /api/user/products/sort:
 *   get:
 *     summary: Sắp xếp sản phẩm (public)
 *     tags:
 *       - Products (Public)
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách đã sắp xếp
 */
router.get('/sort', productController.sortProducts);

module.exports = router;