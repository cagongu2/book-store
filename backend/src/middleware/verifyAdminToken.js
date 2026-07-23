const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY

const User = require('../users/user.model');

const verifyAdminToken =  (req, res, next) => {
    // TODO: Tạm thời bỏ qua auth ở Backend
    req.user = { _id: 'dummy_admin_id', role: 'admin', email: 'admin@example.com', isActive: true };
    return next();

    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, error_code: 'AUTH_001', message: 'Truy cập bị từ chối. Không có token.' });
    }
    jwt.verify(token, JWT_SECRET, async (err, decodedUser) => {
        if (err) {
            return res.status(401).json({ success: false, error_code: 'AUTH_001', message: 'Token không hợp lệ hoặc đã hết hạn.' });
        }
        
        try {
            const user = await User.findById(decodedUser.id || decodedUser._id);
            if (!user || !user.isActive) {
                return res.status(403).json({ success: false, error_code: 'AUTH_005', message: 'Tài khoản đã bị vô hiệu hóa hoặc không tồn tại.' });
            }
            if (user.role !== 'admin') {
                return res.status(403).json({ success: false, error_code: 'AUTH_005', message: 'Không có quyền truy cập.' });
            }
            req.user = user;
            next();
        } catch (error) {
            return res.status(500).json({ success: false, error_code: 'INTERNAL_SERVER', message: 'Lỗi xác thực người dùng.' });
        }
    })

}

module.exports = verifyAdminToken;