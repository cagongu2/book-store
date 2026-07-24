const ApiError = require('../core/ApiError');

const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(ApiError.unauthorized('Truy cập bị từ chối. Không có thông tin xác thực.'));
        }
        
        const userRole = req.user.role || 'ADMINISTRATORS';
        if (allowedRoles.includes('*') || userRole === 'ADMINISTRATORS' || allowedRoles.includes(userRole)) {
            return next();
        }

        return next(ApiError.forbidden('Bạn không có quyền thực hiện thao tác này.'));
    };
};

module.exports = {
    checkRole
};
