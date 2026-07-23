const User = require('./user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ApiResponse = require("../core/ApiResponse");
const ApiError = require("../core/ApiError");
const asyncHandler = require("../core/asyncHandler");
const UserMapper = require("./user.mapper");
const { ErrorCodes } = require('../constants/enums');

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const loginAdmin = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        throw ApiError.badRequest("Vui lòng nhập tên đăng nhập và mật khẩu", ErrorCodes.VALIDATION_ERROR);
    }

    const admin = await User.findOne({ username });
    
    // Don't reveal if admin exists or not in error message to prevent enumeration
    if (!admin) {
        throw ApiError.unauthorized("Sai tên đăng nhập hoặc mật khẩu!", ErrorCodes.INVALID_CREDENTIALS);
    }

    // Check if account is disabled
    if (admin.isActive === false) {
        throw ApiError.forbidden("Tài khoản đã bị vô hiệu hóa!", ErrorCodes.ACCOUNT_DISABLED);
    }

    // Check if account is locked
    if (admin.lockedUntil && admin.lockedUntil > Date.now()) {
        throw new ApiError(429, ErrorCodes.ACCOUNT_LOCKED, "Tài khoản tạm khóa, thử lại sau 15 phút");
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
        // Increment login attempts
        admin.loginAttempts += 1;
        if (admin.loginAttempts >= 5) {
            admin.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
        }
        await admin.save();
        throw ApiError.unauthorized("Sai tên đăng nhập hoặc mật khẩu!", ErrorCodes.INVALID_CREDENTIALS);
    }
    
    // Reset login attempts on success
    admin.loginAttempts = 0;
    admin.lockedUntil = undefined;
    admin.lastLoginAt = new Date();
    await admin.save();

    const token = jwt.sign(
        { id: admin._id, username: admin.username, role: admin.role }, 
        JWT_SECRET,
        { expiresIn: "7d" } // Updated to 7 days based on SRS BR-ADMIN-04
    );

    res.status(200).json(
        ApiResponse.success({
            token: token,
            user: UserMapper.toResponse(admin)
        }, "Đăng nhập thành công")
    );
});

module.exports = {
    loginAdmin
};
