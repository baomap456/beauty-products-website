const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/review.controller');
const { verifyToken } = require('../../utils/jwt');

/**
 * @openapi
 * tags:
 *   - name: Reviews (User)
 *     description: Product reviews endpoints
 *
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         ID_Review:
 *           type: integer
 *         User_ID:
 *           type: integer
 *         Product_ID:
 *           type: integer
 *         Rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         Comment:
 *           type: string
 *         Order_ID:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *     ReviewCreate:
 *       type: object
 *       required:
 *         - productId
 *         - rating
 *       properties:
 *         productId:
 *           type: integer
 *           example: 10
 *         rating:
 *           type: integer
 *           example: 5
 *         comment:
 *           type: string
 *           example: "Great product!"
 *         orderId:
 *           type: integer
 *           example: 123
 */

/**
 * @openapi
 * /api/user/reviews:
 *   post:
 *     tags:
 *       - Reviews (User)
 *     summary: Create a review (authenticated)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewCreate'
 *           examples:
 *             sample:
 *               value:
 *                 productId: 10
 *                 rating: 5
 *                 comment: "Very good!"
 *                 orderId: 45
 *     responses:
 *       201:
 *         description: Review created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 */
router.post('/', verifyToken, ctrl.createReview);

/**
 * @openapi
 * /api/user/reviews/product/{productId}:
 *   get:
 *     tags:
 *       - Reviews (User)
 *     summary: Get reviews for a product (public)
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get('/product/:productId', ctrl.getReviewsByProduct);

/**
 * @openapi
 * /api/user/reviews/mine:
 *   get:
 *     tags:
 *       - Reviews (User)
 *     summary: Get current user's reviews (authenticated)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get('/mine', verifyToken, ctrl.getReviewsByUser);

/**
 * @openapi
 * /api/user/reviews/{reviewId}:
 *   put:
 *     tags:
 *       - Reviews (User)
 *     summary: Update a review (owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: reviewId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Updated comment"
 *     responses:
 *       200:
 *         description: Updated review
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.put('/:reviewId', verifyToken, ctrl.updateReview);

/**
 * @openapi
 * /api/user/reviews/{reviewId}:
 *   delete:
 *     tags:
 *       - Reviews (User)
 *     summary: Delete a review (owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: reviewId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       204:
 *         description: Deleted
 *       401:
 *         description: Unauthorized
 */
router.delete('/:reviewId', verifyToken, ctrl.deleteReview);

/**
 * @openapi
 * /api/user/reviews/stats/{productId}:
 *   get:
 *     tags:
 *       - Reviews (User)
 *     summary: Get review statistics for a product (public)
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Review statistics (counts, avg)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 average:
 *                   type: number
 *                 count:
 *                   type: integer
 */
router.get('/stats/:productId', ctrl.getReviewStats);

/**
 * @openapi
 * /api/user/reviews/top:
 *   get:
 *     tags:
 *       - Reviews (User)
 *     summary: Get top reviews (public)
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Number of top reviews to return
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       200:
 *         description: Top reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get('/top', ctrl.getTopReviews);

module.exports = router;