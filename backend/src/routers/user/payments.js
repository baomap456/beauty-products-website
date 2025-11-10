const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/payment.controller');
const { verifyToken } = require('../../utils/jwt');

/**
 * @openapi
 * tags:
 *   - name: Payments (User)
 *     description: User payment endpoints
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         ID_Payment:
 *           type: integer
 *         Order_ID:
 *           type: integer
 *         Method:
 *           type: string
 *           enum: [cash, card, momo, bank_transfer]
 *         Status:
 *           type: string
 *           enum: [Pending, Paid, Failed, Refunded]
 *         Note:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     PaymentRequest:
 *       type: object
 *       required:
 *         - orderId
 *         - method
 *       properties:
 *         orderId:
 *           type: integer
 *           example: 1
 *         method:
 *           type: string
 *           enum: [cash, card, momo, bank_transfer]
 *           example: momo
 *         note:
 *           type: string
 *           example: "Payment via MoMo wallet"
 */

/**
 * @openapi
 * /api/user/payments:
 *   post:
 *     tags:
 *       - Payments (User)
 *     summary: Create a new payment
 *     description: Create payment for an order (User must own the order)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentRequest'
 *           examples:
 *             momoPayment:
 *               summary: MoMo payment
 *               value:
 *                 orderId: 1
 *                 method: momo
 *                 note: "Payment via MoMo wallet"
 *             cardPayment:
 *               summary: Card payment
 *               value:
 *                 orderId: 2
 *                 method: card
 *                 note: "Credit card payment"
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 payment:
 *                   $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Missing required fields or invalid data
 *       401:
 *         description: Unauthorized
 */
router.post('/', verifyToken, ctrl.createPayment);

/**
 * @openapi
 * /api/user/payments/order/{orderId}:
 *   get:
 *     tags:
 *       - Payments (User)
 *     summary: Get payment by order ID
 *     description: Get payment information for a specific order (User must own the order)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: Order ID to get payment for
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Payment information retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Payment not found
 *       401:
 *         description: Unauthorized
 */
router.get('/order/:orderId', verifyToken, ctrl.getPaymentByOrderId);

module.exports = router;