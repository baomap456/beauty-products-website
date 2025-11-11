const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../utils/jwt');
const ctrl = require('../../controllers/favorite.controller');

/**
 * @openapi
 * tags:
 *   - name: Favorites (User)
 *     description: Quản lý sản phẩm yêu thích của người dùng
 *
 * components:
 *   schemas:
 *     Favorite:
 *       type: object
 *       properties:
 *         ID_Favorite:
 *           type: integer
 *         User_ID:
 *           type: integer
 *         Product_ID:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     FavoriteAddRequest:
 *       type: object
 *       required:
 *         - productId
 *       properties:
 *         productId:
 *           type: integer
 *           example: 15
 */

/**
 * @openapi
 * /api/user/favorites:
 *   post:
 *     tags: [Favorites (User)]
 *     summary: Thêm sản phẩm vào danh sách yêu thích
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FavoriteAddRequest'
 *           examples:
 *             addFavorite:
 *               value:
 *                 productId: 15
 *     responses:
 *       201:
 *         description: Đã thêm vào yêu thích
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favorite'
 *       400:
 *         description: Thiếu productId hoặc đã tồn tại
 *       401:
 *         description: Unauthorized
 */
router.post('/', verifyToken, ctrl.addFavorite);

/**
 * @openapi
 * /api/user/favorites:
 *   delete:
 *     tags: [Favorites (User)]
 *     summary: Xóa sản phẩm khỏi danh sách yêu thích
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FavoriteAddRequest'
 *           examples:
 *             removeFavorite:
 *               value:
 *                 productId: 15
 *     responses:
 *       200:
 *         description: Đã xóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedCount:
 *                   type: integer
 *       404:
 *         description: Không tìm thấy favorite
 *       400:
 *         description: Thiếu productId
 *       401:
 *         description: Unauthorized
 */
router.delete('/', verifyToken, ctrl.removeFavorite);

/**
 * @openapi
 * /api/user/favorites:
 *   get:
 *     tags: [Favorites (User)]
 *     summary: Lấy danh sách yêu thích của người dùng hiện tại
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Favorite'
 *       401:
 *         description: Unauthorized
 */
router.get('/', verifyToken, ctrl.getFavoritesByUser);

/**
 * @openapi
 * /api/user/favorites/count/{productId}:
 *   get:
 *     tags: [Favorites (User)]
 *     summary: Đếm số người dùng đã yêu thích sản phẩm
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 15
 *     responses:
 *       200:
 *         description: Số lượng yêu thích
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *       400:
 *         description: Thiếu productId
 */
router.get('/count/:productId', ctrl.countFavoritesByProduct);

/**
 * @openapi
 * /api/user/favorites/toggle:
 *   post:
 *     tags: [Favorites (User)]
 *     summary: Thêm hoặc gỡ sản phẩm khỏi yêu thích (toggle)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FavoriteAddRequest'
 *           examples:
 *             toggleFavorite:
 *               value:
 *                 productId: 15
 *     responses:
 *       200:
 *         description: Đã gỡ khỏi yêu thích
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       201:
 *         description: Đã thêm vào yêu thích
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favorite'
 *       400:
 *         description: Thiếu productId
 *       401:
 *         description: Unauthorized
 */
router.post('/toggle', verifyToken, ctrl.toggleFavorite);

module.exports = router;