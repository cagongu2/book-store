const express = require('express');
const verifyCustomerToken = require('../middleware/verifyCustomerToken');
const { mergeCart, getCart } = require('./cart.controller');

const router = express.Router();

/**
 * @swagger
 * /api/v1/carts/merge:
 *   post:
 *     summary: Đồng bộ giỏ hàng local lên server khi đăng nhập
 *     tags: [Carts]
 *     security:
 *       - firebaseAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               localCartItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     bookId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Trả về giỏ hàng đã merge
 */
router.post('/merge', verifyCustomerToken, mergeCart);

/**
 * @swagger
 * /api/v1/carts:
 *   get:
 *     summary: Lấy giỏ hàng của user
 *     tags: [Carts]
 *     security:
 *       - firebaseAuth: []
 */
router.get('/', verifyCustomerToken, getCart);

module.exports = router;
