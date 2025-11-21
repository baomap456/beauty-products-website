const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/address.controller');
const { verifyToken } = require('../../utils/jwt');

/**
 * @openapi
 * tags:
 *   - name: Addresses (User)
 *     description: User address management
 *
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         ID_Address:
 *           type: integer
 *         User_ID:
 *           type: integer
 *         RecipientName:
 *           type: string
 *         Phone:
 *           type: string
 *         AddressDetail:
 *           type: string
 *         Province:
 *           type: string
 *         District:
 *           type: string
 *         Ward:
 *           type: string
 *         IsDefault:
 *           type: boolean
 *     AddressCreate:
 *       type: object
 *       required:
 *         - RecipientName
 *         - Phone
 *         - AddressDetail
 *       properties:
 *         RecipientName:
 *           type: string
 *           example: "Nguyen Van A"
 *         Phone:
 *           type: string
 *           example: "0912345678"
 *         AddressDetail:
 *           type: string
 *           example: "123 Le Loi, Phuong Ben Nghe"
 *         Province:
 *           type: string
 *           example: "Ho Chi Minh"
 *         District:
 *           type: string
 *           example: "District 1"
 *         Ward:
 *           type: string
 *           example: "Ward 6"
 *         IsDefault:
 *           type: boolean
 *           example: true
 */

/**
 * @openapi
 * /api/user/addresses:
 *   post:
 *     tags:
 *       - Addresses (User)
 *     summary: Create a new address for current user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressCreate'
 *           example:
 *             RecipientName: "Nguyen Van A"
 *             Phone: "0912345678"
 *             AddressDetail: "123 Le Loi, Phuong Ben Nghe"
 *             Province: "Ho Chi Minh"
 *             District: "District 1"
 *             Ward: "Ward 6"
 *             IsDefault: true
 *     responses:
 *       201:
 *         description: Address created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', verifyToken, ctrl.createAddress);

/**
 * @openapi
 * /api/user/addresses:
 *   get:
 *     tags:
 *       - Addresses (User)
 *     summary: Get all addresses for current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 */
router.get('/', verifyToken, ctrl.getUserAddresses);

/**
 * @openapi
 * /api/user/addresses/{id}:
 *   get:
 *     tags:
 *       - Addresses (User)
 *     summary: Get address by id (must belong to current user)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Address found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       400:
 *         description: Invalid id
 *       404:
 *         description: Address not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', verifyToken, ctrl.getAddress);

/**
 * @openapi
 * /api/user/addresses/{id}:
 *   put:
 *     tags:
 *       - Addresses (User)
 *     summary: Update address by id (must belong to current user)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressCreate'
 *           example:
 *             RecipientName: "Nguyen Van B"
 *             Phone: "0987654321"
 *             AddressDetail: "456 Pasteur, Phuong Ben Nghe"
 *             Province: "Ho Chi Minh"
 *             District: "District 1"
 *             Ward: "Ward 6"
 *             IsDefault: false
 *     responses:
 *       200:
 *         description: Updated address
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Address not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', verifyToken, ctrl.updateAddress);

/**
 * @openapi
 * /api/user/addresses/{id}:
 *   delete:
 *     tags:
 *       - Addresses (User)
 *     summary: Delete address by id (must belong to current user)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Address deleted
 *       400:
 *         description: Invalid id
 *       404:
 *         description: Address not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', verifyToken, ctrl.deleteAddress);

module.exports = router;