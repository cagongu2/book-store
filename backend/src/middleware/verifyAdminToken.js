const jwt = require('jsonwebtoken');
const ApiError = require('../core/ApiError');
const User = require('../users/user.model');

const env = require('../config/env');

const JWT_SECRET = env.JWT_SECRET_KEY;

const verifyAdminToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next(ApiError.unauthorized('Truy cập bị từ chối. Không có token.', 'AUTH_001'));
    }

    jwt.verify(token, JWT_SECRET, async (err, decodedUser) => {
        if (err) {
            return next(ApiError.unauthorized('Token không hợp lệ hoặc đã hết hạn.', 'AUTH_001'));
        }

        try {
            const user = await User.findById(decodedUser.id || decodedUser._id);
            if (!user || !user.isActive) {
                return next(ApiError.forbidden('Tài khoản đã bị vô hiệu hóa hoặc không tồn tại.', 'AUTH_005'));
            }
            req.user = user;
            next();
        } catch (error) {
            return next(error);
        }
    });
};

module.exports = verifyAdminToken;