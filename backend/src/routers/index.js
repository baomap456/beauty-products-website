const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../utils/jwt');

/**
 * @openapi
 * /api/register:
 *   post:
 *     summary: Đăng ký user mới
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FullName:
 *                 type: string
 *               Email:
 *                 type: string
 *               Password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User đã được tạo
 */
router.post('/register', authController.register);

/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: Đăng nhập
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *               Password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Trả về access token
 */
router.post('/login', authController.login);

/**
 * @openapi
 * /api/profile:
 *   get:
 *     summary: Lấy profile user (yêu cầu token)
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin user
 */
router.get('/profile', verifyToken, authController.getProfile);

// mount user and admin routers (user routes under /api/user, admin under /api/admin)
try {
    const userRouter = require('./user');
    router.use('/user', userRouter);
} catch (err) {
    console.warn('Không thể load user router:', err.message);
}

try {
    const adminRouter = require('./admin');
    router.use('/admin', adminRouter);
} catch (err) {
    console.warn('Không thể load admin router:', err.message);
}

module.exports = router;