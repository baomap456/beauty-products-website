const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/cart.controller');
const { verifyToken } = require('../../utils/jwt');

/**
 * @openapi
 * tags:
 *   - name: Cart (User)
 *     description: User cart endpoints
 */

/**
 * @openapi
 * /api/user/cart:
 *   get:
 *     tags:
 *       - Cart (User)
 *     summary: Get current user's active cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart returned
 */
router.get('/', verifyToken, ctrl.getMyCart);

/**
 * @openapi
 * /api/user/cart/items:
 *   post:
 *     tags:
 *       - Cart (User)
 *     summary: Add item to cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *             required:
 *               - productId
 *     responses:
 *       201:
 *         description: Item added
 */
router.post('/items', verifyToken, ctrl.addItem);

/**
 * @openapi
 * /api/user/cart/items/{itemId}:
 *   put:
 *     tags:
 *       - Cart (User)
 *     summary: Update quantity of a cart item (0 to remove)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: itemId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item updated
 */
router.put('/items/:itemId', verifyToken, ctrl.updateItem);

/**
 * @openapi
 * /api/user/cart/items/{itemId}:
 *   delete:
 *     tags:
 *       - Cart (User)
 *     summary: Remove an item from cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: itemId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Item removed
 */
router.delete('/items/:itemId', verifyToken, ctrl.removeItem);

/**
 * @openapi
 * /api/user/cart:
 *   delete:
 *     tags:
 *       - Cart (User)
 *     summary: Clear current user's cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.delete('/', verifyToken, ctrl.clear);

/**
 * @openapi
 * /api/user/cart/merge:
 *   post:
 *     tags:
 *       - Cart (User)
 *     summary: Merge client cart items vào giỏ hàng hiện tại của người dùng
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                 example:
 *                   - { "productId": 1, "quantity": 2 }
 *                   - { "productId": 5, "quantity": 1 }
 *     responses:
 *       200:
 *         description: Cart sau khi merge
 */
router.post('/merge', verifyToken, ctrl.mergeCart);

module.exports = router;