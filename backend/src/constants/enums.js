const OrderStatus = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    SHIPPING: 'shipping',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

const Roles = {
    USER: 'user',
    ADMIN: 'admin'
};

const ErrorCodes = {
    VALIDATION_ERROR: 'ERR_VALIDATION',
    UNAUTHORIZED: 'AUTH_001',
    INVALID_CREDENTIALS: 'AUTH_002',
    ACCOUNT_LOCKED: 'AUTH_003',
    ACCOUNT_DISABLED: 'AUTH_004',
    FORBIDDEN: 'AUTH_005',
    NOT_FOUND: 'ERR_NOT_FOUND',
    CONFLICT: 'ERR_CONFLICT',
    INTERNAL_SERVER: 'ERR_INTERNAL'
};

module.exports = {
    OrderStatus,
    Roles,
    ErrorCodes
};
