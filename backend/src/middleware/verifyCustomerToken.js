const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const Customer = require('../customers/customer.model');

const verifyCustomerToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, error_code: 'AUTH_001', message: 'Truy cập bị từ chối. Không có token.' });
    }
    
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, error_code: 'AUTH_001', message: 'Token không hợp lệ hoặc đã hết hạn.' });
        }
        
        try {
            const customer = await Customer.findById(decoded.id || decoded._id);
            if (!customer || !customer.isActive) {
                return res.status(403).json({ success: false, error_code: 'AUTH_005', message: 'Tài khoản đã bị vô hiệu hóa hoặc không tồn tại.' });
            }
            req.customer = customer;
            next();
        } catch (error) {
            return res.status(500).json({ success: false, error_code: 'INTERNAL_SERVER', message: 'Lỗi xác thực.' });
        }
    });
};

module.exports = verifyCustomerToken;
