const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const { verifyToken, isAdmin } = require('../../utils/jwt');

// Admin routes for products (use middleware, do NOT call controller functions here)

/**
 * @openapi
 * /api/admin/products:
 *   post:
 *     summary: Tạo sản phẩm (admin)
 *     tags:
 *       - Products (Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Sản phẩm được tạo
 */
router.post('/products', verifyToken, isAdmin, productController.createProduct);

/**
 * @openapi
 * /api/admin/products:
 *   get:
 *     summary: Lấy danh sách sản phẩm (admin)
 *     tags:
 *       - Products (Admin)
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 */
router.get('/products', verifyToken, isAdmin, productController.getAllProducts);

/**
 * @openapi
 * /api/admin/products/paginated:
 *   get:
 *     summary: Lấy sản phẩm phân trang (admin)
 *     tags:
 *       - Products (Admin)
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
router.get('/products/paginated', verifyToken, isAdmin, productController.getPaginatedProducts);

/**
 * @openapi
 * /api/admin/products/search:
 *   get:
 *     summary: Tìm kiếm sản phẩm (admin)
 *     tags:
 *       - Products (Admin)
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm
 */
router.get('/products/search', verifyToken, isAdmin, productController.searchProduct);

/**
 * @openapi
 * /api/admin/products/filter:
 *   post:
 *     summary: Lọc sản phẩm (admin)
 *     tags:
 *       - Products (Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Danh sách đã lọc
 */
router.post('/products/filter', verifyToken, isAdmin, productController.filterProducts);

/**
 * @openapi
 * /api/admin/products/sort:
 *   get:
 *     summary: Sắp xếp sản phẩm (admin)
 *     tags:
 *       - Products (Admin)
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
router.get('/products/sort', verifyToken, isAdmin, productController.sortProducts);

/**
 * @openapi
 * /api/admin/products/{id}:
 *   get:
 *     summary: Lấy sản phẩm theo id (admin)
 *     tags:
 *       - Products (Admin)
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
router.get('/products/:id', verifyToken, isAdmin, productController.getProductById);

/**
 * @openapi
 * /api/admin/products/{id}:
 *   put:
 *     summary: Cập nhật sản phẩm (admin)
 *     tags:
 *       - Products (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Sản phẩm được cập nhật
 */
router.put('/products/:id', verifyToken, isAdmin, productController.updateProduct);

/**
 * @openapi
 * /api/admin/products/{id}:
 *   delete:
 *     summary: Xóa sản phẩm (admin)
 *     tags:
 *       - Products (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       204:
 *         description: Đã xóa
 */
router.delete('/products/:id', verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;