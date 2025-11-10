const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/order.controller');
const { verifyToken, isAdmin } = require('../../utils/jwt');

/**
 * @openapi
 * tags:
 *   - name: Orders (Admin)
 *     description: Admin order management endpoints
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         ID_Order:
 *           type: integer
 *         User_ID:
 *           type: integer
 *         Address_ID:
 *           type: integer
 *         Discount_ID:
 *           type: integer
 *         Total_Amount:
 *           type: number
 *         Status:
 *           type: string
 *           enum: [Pending, Processing, Completed, Cancelled]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     OrderDetail:
 *       type: object
 *       properties:
 *         ID_OrderDetail:
 *           type: integer
 *         Order_ID:
 *           type: integer
 *         Product_ID:
 *           type: integer
 *         Quantity:
 *           type: integer
 *         Price:
 *           type: number
 */

/**
 * @openapi
 * /api/admin/orders:
 *   get:
 *     tags:
 *       - Orders (Admin)
 *     summary: Get all orders with pagination (Admin only)
 *     description: Returns paginated list of all orders with order details and product info
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number (default 1)
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Number of items per page (default 20)
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *           example: 20
 *     responses:
 *       200:
 *         description: Successfully retrieved orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 count:
 *                   type: integer
 *                   description: Total number of orders
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 limit:
 *                   type: integer
 *                   description: Items per page
 *             example:
 *               rows:
 *                 - ID_Order: 1
 *                   User_ID: 5
 *                   Total_Amount: 150000
 *                   Status: Pending
 *                   orderDetails:
 *                     - ID_OrderDetail: 1
 *                       Product_ID: 10
 *                       Quantity: 2
 *                       Price: 75000
 *               count: 50
 *               page: 1
 *               limit: 20
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.get('/', verifyToken, isAdmin, ctrl.listOrders);

/**
 * @openapi
 * /api/admin/orders/{id}:
 *   get:
 *     tags:
 *       - Orders (Admin)
 *     summary: Get order details by ID (Admin only)
 *     description: Returns complete order information including order details, products, payment, and address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Order ID
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *             example:
 *               ID_Order: 1
 *               User_ID: 5
 *               Address_ID: 3
 *               Discount_ID: null
 *               Total_Amount: 150000
 *               Status: Processing
 *               orderDetails:
 *                 - ID_OrderDetail: 1
 *                   Product_ID: 10
 *                   Quantity: 2
 *                   Price: 75000
 *                   product:
 *                     ID_Product: 10
 *                     Name: Serum Vitamin C
 *                     Price: 75000
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.get('/:id', verifyToken, isAdmin, ctrl.getOrderByAdmin);

/**
 * @openapi
 * /api/admin/orders/{id}/status:
 *   put:
 *     tags:
 *       - Orders (Admin)
 *     summary: Update order status (Admin only)
 *     description: Update the status of an order. Can optionally update payment status when marking as Completed
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Order ID to update
 *         required: true
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
 *                 enum: [Pending, Processing, Completed, Cancelled]
 *                 description: New order status
 *                 example: Processing
 *               updatePayment:
 *                 type: boolean
 *                 description: If true, updates payment to 'Paid' when status is 'Completed'
 *                 default: false
 *                 example: true
 *           examples:
 *             markProcessing:
 *               summary: Mark order as Processing
 *               value:
 *                 status: Processing
 *                 updatePayment: false
 *             markCompleted:
 *               summary: Mark order as Completed and update payment
 *               value:
 *                 status: Completed
 *                 updatePayment: true
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request - Missing status or invalid state transition
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             examples:
 *               missingStatus:
 *                 summary: Missing status field
 *                 value:
 *                   error: Missing status
 *               invalidState:
 *                 summary: Cannot update completed order
 *                 value:
 *                   error: Cannot update completed or cancelled orders
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.put('/:id/status', verifyToken, isAdmin, ctrl.updateOrderStatusByAdmin);

/**
 * @openapi
 * /api/admin/orders/{id}/cancel:
 *   post:
 *     tags:
 *       - Orders (Admin)
 *     summary: Cancel an order (Admin only)
 *     description: Cancel an order and optionally refund payment. Only Pending/Processing orders can be cancelled
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Order ID to cancel
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refundPayment:
 *                 type: boolean
 *                 description: If true, marks payment as 'Refunded'
 *                 default: false
 *                 example: true
 *           examples:
 *             withRefund:
 *               summary: Cancel with payment refund
 *               value:
 *                 refundPayment: true
 *             withoutRefund:
 *               summary: Cancel without refund
 *               value:
 *                 refundPayment: false
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *             example:
 *               ID_Order: 1
 *               Status: Cancelled
 *               Total_Amount: 150000
 *       400:
 *         description: Cannot cancel - order already completed or cancelled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Cannot cancel completed or already cancelled orders
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.post('/:id/cancel', verifyToken, isAdmin, ctrl.cancelOrderByAdmin);

module.exports = router;