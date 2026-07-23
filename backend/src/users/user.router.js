const express =  require('express');
const User = require('./user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router =  express.Router();

const JWT_SECRET = process.env.JWT_SECRET_KEY

/**
 * @swagger
 * /api/v1/auth/admin:
 *   post:
 *     summary: Admin login
 *     description: Login for admin users using username and password. Supports lockout mechanism after 5 failed attempts.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication successful
 *       400:
 *         description: Bad request (missing fields)
 *       401:
 *         description: Unauthorized (Invalid credentials)
 *       403:
 *         description: Forbidden (Account disabled)
 *       429:
 *         description: Too many requests (Account locked temporarily)
 *       500:
 *         description: Server error
 */
router.post("/admin", async (req, res) => {
    const {username, password} = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ success: false, error_code: "AUTH_001", message: "Vui lòng nhập tên đăng nhập và mật khẩu" });
    }

    try {
        const admin = await User.findOne({username});
        
        // Don't reveal if admin exists or not in error message to prevent enumeration
        if (!admin) {
            return res.status(401).json({ success: false, error_code: "AUTH_002", message: "Sai tên đăng nhập hoặc mật khẩu!" });
        }

        // Check if account is disabled
        if (admin.isActive === false) {
            return res.status(403).json({ success: false, error_code: "AUTH_004", message: "Tài khoản đã bị vô hiệu hóa!" });
        }

        // Check if account is locked
        if (admin.lockedUntil && admin.lockedUntil > Date.now()) {
            return res.status(429).json({ success: false, error_code: "AUTH_003", message: "Tài khoản tạm khóa, thử lại sau 15 phút" });
        }

        const isPasswordMatch = await bcrypt.compare(password, admin.password);

        if (!isPasswordMatch) {
            // Increment login attempts
            admin.loginAttempts += 1;
            if (admin.loginAttempts >= 5) {
                admin.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
            }
            await admin.save();
            return res.status(401).json({ success: false, error_code: "AUTH_002", message: "Sai tên đăng nhập hoặc mật khẩu!" });
        }
        
        // Reset login attempts on success
        admin.loginAttempts = 0;
        admin.lockedUntil = undefined;
        admin.lastLoginAt = new Date();
        await admin.save();

        const token = jwt.sign(
            {id: admin._id, username: admin.username, role: admin.role}, 
            JWT_SECRET,
            {expiresIn: "7d"} // Updated to 7 days based on SRS BR-ADMIN-04
        )

        return res.status(200).json({
            success: true,
            message: "Authentication successful",
            token: token,
            user: {
                id: admin._id,
                username: admin.username,
                role: admin.role
            }
        })
        
    } catch (error) {
       console.error("Failed to login as admin", error)
       res.status(500).json({ success: false, message: "Failed to login as admin" }) 
    }
})

module.exports = router;