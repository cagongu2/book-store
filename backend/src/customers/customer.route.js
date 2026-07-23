const express = require('express');
const Customer = require('./customer.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const verifyCustomerToken = require('../middleware/verifyCustomerToken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

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
router.post('/register', async (req, res) => {
    const { email, password, displayName } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp email và password' });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }

    try {
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(409).json({ success: false, message: 'Email đã được sử dụng' });
        }

        const newCustomer = new Customer({
            email,
            password,
            displayName: displayName || email.split('@')[0]
        });

        await newCustomer.save();

        const token = jwt.sign(
            { id: newCustomer._id, email: newCustomer.email },
            JWT_SECRET,
            { expiresIn: '30d' } // Customer token valid for 30 days
        );

        return res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            token,
            customer: {
                id: newCustomer._id,
                email: newCustomer.email,
                displayName: newCustomer.displayName
            }
        });
    } catch (error) {
        console.error('Error registering customer:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

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
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp email và password' });
    }

    try {
        const customer = await Customer.findOne({ email });
        
        if (!customer) {
            return res.status(401).json({ success: false, error_code: 'AUTH_002', message: 'Sai email hoặc mật khẩu' });
        }

        if (customer.isActive === false) {
            return res.status(403).json({ success: false, message: 'Tài khoản đã bị vô hiệu hóa' });
        }

        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error_code: 'AUTH_002', message: 'Sai email hoặc mật khẩu' });
        }
        
        const token = jwt.sign(
            { id: customer._id, email: customer.email },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        return res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            token,
            customer: {
                id: customer._id,
                email: customer.email,
                displayName: customer.displayName,
                photoURL: customer.photoURL
            }
        });

    } catch (error) {
        console.error('Error logging in customer:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

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
router.get('/profile', verifyCustomerToken, async (req, res) => {
    try {
        const customer = await Customer.findById(req.customer.id).select('-password');
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' });
        }
        
        return res.status(200).json({ success: true, customer });
    } catch (error) {
        console.error('Error fetching customer profile:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

module.exports = router;
