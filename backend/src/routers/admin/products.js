const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const { verifyToken, isAdmin } = require('../../utils/jwt');

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
 *             required:
 *               - Name_Product
 *               - Price
 *             properties:
 *               Name_Product:
 *                 type: string
 *                 example: "Kem dưỡng da ban đêm"
 *               Price:
 *                 type: number
 *                 format: float
 *                 example: 199000.00
 *               Stock:
 *                 type: integer
 *                 example: 50
 *               Description:
 *                 type: string
 *                 example: "Kem dưỡng ẩm, phục hồi da"
 *               Category_ID:
 *                 type: integer
 *                 example: 2
 *               Brand_ID:
 *                 type: integer
 *                 example: 3
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
 *     security:
 *       - bearerAuth: []
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
 *         description: Danh sách sản phẩm
 */
router.get('/products', verifyToken, isAdmin, productController.getAllProducts);

/**
 * @openapi
 * /api/admin/products/{id}:
 *   get:
 *     summary: Lấy sản phẩm theo id (admin)
 *     tags:
 *       - Products (Admin)
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
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name_Product:
 *                 type: string
 *                 example: "Kem dưỡng mới"
 *               Price:
 *                 type: number
 *                 format: float
 *                 example: 210000.00
 *               Stock:
 *                 type: integer
 *                 example: 30
 *               Description:
 *                 type: string
 *                 example: "Mô tả cập nhật"
 *               Category_ID:
 *                 type: integer
 *                 example: 2
 *               Brand_ID:
 *                 type: integer
 *                 example: 3
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
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Đã xóa
 */
router.delete('/products/:id', verifyToken, isAdmin, productController.deleteProduct);

/**
 * Other product admin endpoints (search, filter, sort, paginated) remain unchanged
 */
router.get('/products/paginated', verifyToken, isAdmin, productController.getPaginatedProducts);
router.get('/products/search', verifyToken, isAdmin, productController.searchProduct);
router.post('/products/filter', verifyToken, isAdmin, productController.filterProducts);
router.get('/products/sort', verifyToken, isAdmin, productController.sortProducts);

module.exports = router;