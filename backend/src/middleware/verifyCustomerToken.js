const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyCustomerToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, error_code: 'AUTH_001', message: 'Truy cập bị từ chối. Không có token.' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, error_code: 'AUTH_001', message: 'Token không hợp lệ hoặc đã hết hạn.' });
        }
        
        req.customer = decoded;
        next();
    });
};

module.exports = verifyCustomerToken;
