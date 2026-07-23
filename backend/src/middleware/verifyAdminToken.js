const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY

const verifyAdminToken =  (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, error_code: 'AUTH_001', message: 'Truy cập bị từ chối. Không có token.' });
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ success: false, error_code: 'AUTH_001', message: 'Token không hợp lệ hoặc đã hết hạn.' });
        }
        
        // Ensure user is an admin
        if (user.role !== 'admin') {
            return res.status(403).json({ success: false, error_code: 'AUTH_005', message: 'Không có quyền truy cập.' });
        }
        
        req.user = user;
        next();
    })

}

module.exports = verifyAdminToken;