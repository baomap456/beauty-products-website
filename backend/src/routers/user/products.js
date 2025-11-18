const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');

/**
 * @openapi
 * /api/user/products:
 *   get:
 *     summary: Lấy danh sách sản phẩm (Public, hỗ trợ phân trang / lọc / tìm kiếm)
 *     tags:
 *       - Products (Public)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Trang số (bắt đầu từ 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Số phần tử trên mỗi trang
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên sản phẩm (partial match)
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Lọc theo ID danh mục
 *       - in: query
 *         name: brand_id
 *         schema:
 *           type: integer
 *         description: Lọc theo ID thương hiệu
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Giá thấp nhất (lọc)
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Giá cao nhất (lọc)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, newest, oldest]
 *         description: Sắp xếp kết quả
 *     responses:
 *       '200':
 *         description: Danh sách sản phẩm (có phân trang)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                   description: Tổng số sản phẩm thỏa điều kiện
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 items:
 *                   type: array
 *                   description: Mảng sản phẩm
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       stock:
 *                         type: integer
 *                       category:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                       brand:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                       mainImage:
 *                         type: string
 *                       secondaryImages:
 *                         type: array
 *                         items:
 *                           type: string
 *       '400':
 *         description: Yêu cầu không hợp lệ (ví dụ param sai định dạng)
 *       '500':
 *         description: Lỗi server
 */

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
 *       '200':
 *         description: Thông tin sản phẩm
 *       '404':
 *         description: Không tìm thấy sản phẩm
 */
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

module.exports = router;