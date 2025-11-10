const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/payment.controller');
const { verifyToken, isAdmin } = require('../../utils/jwt');

/**
 * @openapi
 * tags:
 *   - name: Payments (Admin)
 *     description: Admin payment management endpoints
 */

/**
 * @openapi
 * /api/admin/payments:
 *   get:
 *     tags:
 *       - Payments (Admin)
 *     summary: Get all payments with filtering (Admin only)
 *     description: Retrieve all payments with optional filtering by status, method, and pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number (default 1)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Items per page (default 20)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *           example: 20
 *       - name: status
 *         in: query
 *         description: Filter by payment status
 *         schema:
 *           type: string
 *           enum: [Pending, Paid, Failed, Refunded]
 *           example: Pending
 *       - name: method
 *         in: query
 *         description: Filter by payment method
 *         schema:
 *           type: string
 *           enum: [cash, card, momo, bank_transfer]
 *           example: momo
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/', verifyToken, isAdmin, ctrl.getAllPayments);

/**
 * @openapi
 * /api/admin/payments/order/{orderId}:
 *   get:
 *     tags:
 *       - Payments (Admin)
 *     summary: Get payment by order ID (Admin)
 *     description: Get payment information for any order (Admin access)
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
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/order/:orderId', verifyToken, isAdmin, ctrl.getPaymentByOrderId);

/**
 * @openapi
 * /api/admin/payments/order/{orderId}/status:
 *   put:
 *     tags:
 *       - Payments (Admin)
 *     summary: Update payment status (Admin only)
 *     description: Update the status of a payment for a specific order
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: Order ID to update payment status
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Paid, Failed, Refunded]
 *                 description: New payment status
 *                 example: Paid
 *           examples:
 *             markPaid:
 *               summary: Mark payment as Paid
 *               value:
 *                 status: Paid
 *             markFailed:
 *               summary: Mark payment as Failed
 *               value:
 *                 status: Failed
 *             markRefunded:
 *               summary: Mark payment as Refunded
 *               value:
 *                 status: Refunded
 *     responses:
 *       200:
 *         description: Payment status updated successfully
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
 *         description: Missing status or invalid status value
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Payment not found
 */
router.put('/order/:orderId/status', verifyToken, isAdmin, ctrl.updatePaymentStatus);

module.exports = router;