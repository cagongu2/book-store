const express = require('express');
const verifyCustomerToken = require('../middleware/verifyCustomerToken');
const { registerCustomer, loginCustomer, getProfile } = require('./customer.controller');

const router = express.Router();

/**
 * @swagger
 * /api/v1/customers/register:
 *   post:
 *     summary: Đăng ký tài khoản khách hàng
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               displayName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Thiếu thông tin hoặc email không hợp lệ
 *       409:
 *         description: Email đã tồn tại
 */
router.post('/register', registerCustomer);

/**
 * @swagger
 * /api/v1/customers/login:
 *   post:
 *     summary: Đăng nhập tài khoản khách hàng
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Sai email hoặc mật khẩu
 *       403:
 *         description: Tài khoản bị vô hiệu hóa
 */
router.post('/login', loginCustomer);

/**
 * @swagger
 * /api/v1/customers/profile:
 *   get:
 *     summary: Lấy thông tin profile khách hàng
 *     tags: [Customers]
 *     security:
 *       - firebaseAuth: []
 *     responses:
 *       200:
 *         description: Thông tin khách hàng
 *       401:
 *         description: Chưa xác thực
 */
router.get('/profile', verifyCustomerToken, getProfile);

module.exports = router;
