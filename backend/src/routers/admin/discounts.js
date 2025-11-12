const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../../utils/jwt');
const ctrl = require('../../controllers/discount.controller');

/**
 * @openapi
 * tags:
 *   - name: Discounts (Admin)
 *     description: Quản lý mã giảm giá (Admin)
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Discount:
 *       type: object
 *       properties:
 *         ID_Discount:
 *           type: integer
 *         Code:
 *           type: string
 *         Description:
 *           type: string
 *         Value:
 *           type: number
 *           description: phần trăm hoặc số tiền
 *         StartDate:
 *           type: string
 *           format: date-time
 *         EndDate:
 *           type: string
 *           format: date-time
 *         UsageLimit:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     DiscountCreate:
 *       type: object
 *       required: [Code, Value, StartDate, EndDate]
 *       properties:
 *         Code: { type: string, example: "SUMMER50" }
 *         Description: { type: string, example: "Giảm 50% mùa hè" }
 *         Value: { type: number, example: 50 }
 *         StartDate: { type: string, format: date-time, example: "2025-06-01T00:00:00Z" }
 *         EndDate: { type: string, format: date-time, example: "2025-06-30T23:59:59Z" }
 *         UsageLimit: { type: integer, example: 1000 }
 */

/**
 * @openapi
 * /api/admin/discounts:
 *   post:
 *     tags: [Discounts (Admin)]
 *     summary: Tạo mã giảm giá
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/DiscountCreate' }
 *           examples:
 *             create:
 *               value:
 *                 Code: "SUMMER50"
 *                 Description: "Giảm 50% mùa hè"
 *                 Value: 50
 *                 StartDate: "2025-06-01T00:00:00Z"
 *                 EndDate: "2025-06-30T23:59:59Z"
 *                 UsageLimit: 1000
 *     responses:
 *       201:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Discount' }
 *       500: { description: Lỗi server }
 */
router.post('/', verifyToken, isAdmin, ctrl.createDiscount);

/**
 * @openapi
 * /api/admin/discounts:
 *   get:
 *     tags: [Discounts (Admin)]
 *     summary: Lấy tất cả mã giảm giá
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Danh sách mã giảm giá
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Discount' }
 *       500: { description: Lỗi server }
 */
router.get('/', verifyToken, isAdmin, ctrl.getAllDiscounts);

/**
 * @openapi
 * /api/admin/discounts/{id}:
 *   get:
 *     tags: [Discounts (Admin)]
 *     summary: Lấy chi tiết mã giảm giá
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200: { description: Thành công, content: { application/json: { schema: { $ref: '#/components/schemas/Discount' } } } }
 *       404: { description: Không tìm thấy }
 *       500: { description: Lỗi server }
 */
router.get('/:id', verifyToken, isAdmin, ctrl.getDiscountById);

/**
 * @openapi
 * /api/admin/discounts/{id}:
 *   put:
 *     tags: [Discounts (Admin)]
 *     summary: Cập nhật mã giảm giá
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/DiscountCreate' }
 *     responses:
 *       200: { description: Cập nhật thành công }
 *       404: { description: Không tìm thấy }
 *       500: { description: Lỗi server }
 */
router.put('/:id', verifyToken, isAdmin, ctrl.updateDiscount);

/**
 * @openapi
 * /api/admin/discounts/{id}:
 *   delete:
 *     tags: [Discounts (Admin)]
 *     summary: Xóa mã giảm giá
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Xóa thành công }
 *       404: { description: Không tìm thấy }
 *       500: { description: Lỗi server }
 */
router.delete('/:id', verifyToken, isAdmin, ctrl.deleteDiscount);

/**
 * @openapi
 * /api/admin/discounts/active:
 *   get:
 *     tags: [Discounts (Admin)]
 *     summary: Mã giảm giá đang hoạt động
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Danh sách active
 *       500:
 *         description: Lỗi server
 */
router.get('/active', verifyToken, isAdmin, ctrl.getActiveDiscounts);

/**
 * @openapi
 * /api/admin/discounts/expired:
 *   get:
 *     tags: [Discounts (Admin)]
 *     summary: Mã giảm giá đã hết hạn
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Danh sách expired }
 *       500: { description: Lỗi server }
 */
router.get('/expired', verifyToken, isAdmin, ctrl.getExpiredDiscounts);

module.exports = router;