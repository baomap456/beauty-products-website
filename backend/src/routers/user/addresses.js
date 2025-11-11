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
 *         FullName:
 *           type: string
 *         Phone:
 *           type: string
 *         Street:
 *           type: string
 *         City:
 *           type: string
 *         Province:
 *           type: string
 *         Country:
 *           type: string
 *         PostalCode:
 *           type: string
 *         IsDefault:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     AddressCreate:
 *       type: object
 *       required:
 *         - FullName
 *         - Phone
 *         - Street
 *         - City
 *         - Province
 *       properties:
 *         FullName:
 *           type: string
 *           example: "Nguyen Van A"
 *         Phone:
 *           type: string
 *           example: "0912345678"
 *         Street:
 *           type: string
 *           example: "123 Le Loi"
 *         City:
 *           type: string
 *           example: "Ho Chi Minh"
 *         Province:
 *           type: string
 *           example: "HCM"
 *         Country:
 *           type: string
 *           example: "Vietnam"
 *         PostalCode:
 *           type: string
 *           example: "700000"
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
 *           examples:
 *             addExample:
 *               summary: Create address example
 *               value:
 *                 FullName: "Nguyen Van A"
 *                 Phone: "0912345678"
 *                 Street: "123 Le Loi"
 *                 City: "Ho Chi Minh"
 *                 Province: "HCM"
 *                 Country: "Vietnam"
 *                 PostalCode: "700000"
 *                 IsDefault: true
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
 *           examples:
 *             updateExample:
 *               value:
 *                 FullName: "Nguyen Van B"
 *                 Phone: "0987654321"
 *                 Street: "456 Pasteur"
 *                 City: "Ho Chi Minh"
 *                 Province: "HCM"
 *                 IsDefault: false
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