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
router.post('/', verifyToken, isAdmin, productController.createProduct);

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
router.get('/', verifyToken, isAdmin, productController.getAllProducts);

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
router.get('/:id', verifyToken, isAdmin, productController.getProductById);

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
router.put('/:id', verifyToken, isAdmin, productController.updateProduct);

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
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);


/**
 * @openapi
 * /api/admin/products/search:
 *   get:
 *     summary: Tìm kiếm sản phẩm (admin)
 *     tags: [Products (Admin)]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: q
 *         description: Từ khóa tìm kiếm
 *         required: true
 *         schema: { type: string, example: "kem dưỡng" }
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm
 */
router.get('/search', verifyToken, isAdmin, productController.searchProduct);

/**
 * @openapi
 * components:
 *   schemas:
 *     AdminProductFilterRequest:
 *       type: object
 *       properties:
 *         categoryId: { type: integer, example: 2 }
 *         brandId: { type: integer, example: 3 }
 *         priceMin: { type: number, example: 100000 }
 *         priceMax: { type: number, example: 500000 }
 *         inStock: { type: boolean, example: true }
 *
 * /api/admin/products/filter:
 *   post:
 *     summary: Lọc sản phẩm (admin)
 *     tags: [Products (Admin)]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminProductFilterRequest'
 *     responses:
 *       200:
 *         description: Kết quả lọc
 */
router.post('/filter', verifyToken, isAdmin, productController.filterProducts);

/**
 * @openapi
 * /api/admin/products/sort:
 *   get:
 *     summary: Sắp xếp sản phẩm (admin)
 *     tags: [Products (Admin)]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         description: Trường sắp xếp
 *         schema:
 *           type: string
 *           enum: [Name_Product, Price, Stock, createdAt]
 *           example: Price
 *       - in: query
 *         name: order
 *         description: Thứ tự sắp xếp
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: asc
 *     responses:
 *       200:
 *         description: Danh sách đã sắp xếp
 */
router.get('/sort', verifyToken, isAdmin, productController.sortProducts);

// giữ các route động ở dưới để tránh conflict
router.get('/:id', verifyToken, isAdmin, productController.getProductById);
router.put('/:id', verifyToken, isAdmin, productController.updateProduct);
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;