const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/order.controller');
const { verifyToken } = require('../../utils/jwt');

/**
 * @openapi
 * tags:
 *   - name: Orders (User)
 *     description: User order endpoints
 */

/**
 * @openapi
 * /api/user/orders:
 *   post:
 *     tags:
 *       - Orders (User)
 *     summary: Checkout cart -> create order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartId:
 *                 type: integer
 *               addressId:
 *                 type: integer
 *               discountId:
 *                 type: integer
 *               paymentPayload:
 *                 type: object
 *     responses:
 *       201:
 *         description: Order created
 */
router.post('/', ctrl.checkout);

/**
 * @openapi
 * /api/user/orders:
 *   get:
 *     tags:
 *       - Orders (User)
 *     summary: Get current user's orders (paginated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated orders
 */
router.get('/', ctrl.myOrders);

/**
 * @openapi
 * /api/user/orders/{id}:
 *   get:
 *     tags:
 *       - Orders (User)
 *     summary: Get order detail by id
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
 *         description: Order detail
 */
router.get('/:id', ctrl.getOrderByUser);

module.exports = router;