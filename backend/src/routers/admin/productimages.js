const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/productimage.controller');
const { verifyToken, isAdmin } = require('../../utils/jwt');
const { uploadFields } = require('../../utils/multer');

/**
 * @openapi
 * /api/admin/products/{id}/images:
 *   post:
 *     summary: Upload avatar (single) and/or multiple images for a product (admin)
 *     tags:
 *       - Product Images (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Single avatar image (will replace product avatar if Product has avatar column)
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Multiple product images
 *           encoding:
 *             avatar:
 *               contentType: image/*
 *             images:
 *               contentType: image/*
 *               style: form
 *               explode: true
 *     responses:
 *       201:
 *         description: Images uploaded
 */
const uploader = uploadFields([{ name: 'avatar', maxCount: 1 }, { name: 'images', maxCount: 10 }]);

router.post('/:id/images', verifyToken, isAdmin, (req, res, next) => {
    uploader(req, res, (err) => {
        if (err) return next(err);
        ctrl.uploadImages(req, res);
    });
});

/**
 * @openapi
 * /api/admin/products/{id}/images:
 *   get:
 *     summary: List images for a product (admin)
 *     tags:
 *       - Product Images (Admin)
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id/images', verifyToken, isAdmin, ctrl.listImages);

/**
 * @openapi
 * /api/admin/products/{id}/images/{imageId}:
 *   delete:
 *     summary: Delete an image (admin)
 *     tags:
 *       - Product Images (Admin)
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id/images/:imageId', verifyToken, isAdmin, ctrl.deleteImage);

module.exports = router;