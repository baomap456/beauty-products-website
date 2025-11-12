const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../utils/jwt');
const ctrl = require('../../controllers/discount.controller');

/**
 * @openapi
 * tags:
 *   - name: Discounts (User)
 *     description: Áp dụng mã giảm giá cho đơn hàng
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     ApplyDiscountRequest:
 *       type: object
 *       required: [code, orderTotal]
 *       properties:
 *         code:
 *           type: string
 *           example: "SUMMER50"
 *         orderTotal:
 *           type: number
 *           example: 250000
 */

/**
 * @openapi
 * /api/user/discounts/apply:
 *   post:
 *     tags: [Discounts (User)]
 *     summary: Áp dụng mã giảm giá vào tổng đơn
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ApplyDiscountRequest' }
 *           examples:
 *             applyExample:
 *               value:
 *                 code: "SUMMER50"
 *                 orderTotal: 250000
 *     responses:
 *       200:
 *         description: Áp dụng thành công
 *       400:
 *         description: Mã giảm giá không hợp lệ / hết hạn
 *       500:
 *         description: Lỗi server
 */
router.post('/apply', verifyToken, ctrl.applyDiscount);

module.exports = router;